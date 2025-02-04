import { createServer } from 'http';
import app from './app.prod';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = createServer(app);

server.listen(PORT, () => {
    console.log(`🚀 Production server running on http://your-public-ip:${PORT}`);
});
