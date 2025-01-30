import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import fs from 'fs';
import https from 'https';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import { validateEnv } from './helpers/validate-env';
import { connectDbDev } from './config/db';

dotenv.config();

try {
    validateEnv();
} catch (error: any) {
    console.error(error.message);
    process.exit(1);
}

const app = express();

// Secure Headers
app.use(helmet());

// Parse JSON & URL Encoded Data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Enable CORS for frontend access
app.use(
    cors({
        origin: process.env.CORS_ORIGIN!.split(','), // Allow multiple origins
        methods: process.env.CORS_METHODS?.split(',') || ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
);

// Logging
app.use(morgan('combined'));

// Connect to Database
connectDbDev();

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/product', productRoutes);

// Test Route
app.use('/test', (req: Request, res: Response) => {
    res.send('Backend Working in Production Mode');
});

export default app;
