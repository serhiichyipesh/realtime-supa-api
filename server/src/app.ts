import { FG_GREEN, FG_MAGENTA, RESET } from './lib/constants.js';
import {
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
  createClient,
} from '@supabase/supabase-js';

import { CacheService } from './services/cache-service.js';
import { LoggerService } from './services/logger-service.js';
import { Server } from 'socket.io';
import { SupabaseService } from './services/supabase-service.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import { errorHandler } from './middleware/error-handler.js';
import express from 'express';
import http from 'http';
import { subscribeToDBChange } from './lib/utils.js';
import tableRoutes from './routes/table-routes.js';

const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const supabase = new SupabaseService(supabaseClient);
export const cacheService = new CacheService();
export const loggerService = new LoggerService();

const app = express();
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(errorHandler);
app.use(bodyParser.json());

app.use((req, _, next) => {
  loggerService.info('Incoming request', { method: req.method, url: req.url });
  next();
});

app.get('/', (_, res) => {
  res.send('OK');
});

app.use('/table', tableRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  loggerService.info('New Socket.IO connection:', { socketId: socket.id });
  socket.on('disconnect', (reason) => {
    loggerService.info('Socket disconnected', { socketId: socket.id, reason });
  });
});

const insertSubscription = subscribeToDBChange({
  channel: 'table:insert',
  event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT,
  table: 'table',
  handler: (payload) => {
    loggerService.info('Table insert', { payload });
    cacheService.invalidate('table');
    io.emit('table_insert', payload.new);
  },
  supabase: supabaseClient,
});

const deleteSubscription = subscribeToDBChange({
  channel: 'table:delete',
  event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE,
  table: 'table',
  handler: (payload) => {
    loggerService.info('Table delete', { payload });
    cacheService.invalidate('table');
    io.emit('table_delete', payload.old);
  },
  supabase: supabaseClient,
});

server.listen(PORT, () => {
  const message = `
    ${FG_MAGENTA}          Time: ${new Date().toLocaleString()}${RESET}
    ${FG_GREEN} 🚀  Server is up and running on port ${PORT}  🚀${RESET}
  `;

  loggerService.info(message);
});

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, async () => {
    const fgRed = '\x1b[31m';
    loggerService.info(`${fgRed}Shutting down server... (${signal})`);
    await Promise.all([
      insertSubscription.unsubscribe(),
      deleteSubscription.unsubscribe(),
    ]);
    process.exit(0);
  });
});

export default app;