import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import testRoutes from './routes/test.js';
import transcribeRoutes from './routes/transcribe.js';
import suggestionsRoutes from './routes/suggestions.js';
import chatRoutes from './routes/chat.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/test', testRoutes);
app.use('/api/transcribe', transcribeRoutes);
app.use('/api/suggestions', suggestionsRoutes);
app.use('/api/chat', chatRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});