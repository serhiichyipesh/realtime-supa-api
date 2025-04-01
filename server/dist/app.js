import { createClient } from '@supabase/supabase-js';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { errorHandler } from './middleware/error-handler.js';
import tableRoutes from './routes/table-routes.js';
import { CacheService } from './services/cache-service.js';
import { SupabaseService } from './services/supabase-service.js';
const PORT = process.env.PORT || 3001;
const supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export const supabase = new SupabaseService(supabaseClient);
export const cacheService = new CacheService();
const app = express();
app.use(cors());
app.use(errorHandler);
app.use(bodyParser.json());
app.get('/', (_, res) => {
    res.send('OK');
});
app.use('/table', tableRoutes);
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Adjust this for your production environment
        methods: ['GET', 'POST'],
    },
});
// Listen for Socket.IO connections
io.on('connection', (socket) => {
    console.log('New Socket.IO connection:', socket.id);
    // Optionally, you could handle subscription events from clients here.
});
const tableSubscription = supabaseClient
    .channel('table')
    .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'table',
}, (payload) => {
    cacheService.invalidate('table');
    io.emit('table_insert', payload.new);
    console.log('Supabase insert event received and emitted via Socket.IO:', payload);
})
    .subscribe();
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await tableSubscription.unsubscribe();
    process.exit(0);
});
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map