import bodyParser from 'body-parser';
import cors from "cors";
import { errorHandler } from './middleware/error-handler.js';
import express from "express";
import tableRoutes from './routes/table-routes.js';

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(errorHandler);
app.use(bodyParser.json());

app.get('/', (_, res) => {
  res.send('OK');
});

app.use('/table', tableRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

