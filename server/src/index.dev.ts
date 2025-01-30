import { createServer } from 'http';
import app from './app.dev';
import dotenv from 'dotenv'

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = createServer(app);

server.listen(PORT, () => {
    console.log(`Development server running on http://localhost:${PORT}`);
});