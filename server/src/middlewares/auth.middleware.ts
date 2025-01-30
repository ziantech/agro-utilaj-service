import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model'

interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: { id: string}; // Extend the Request object
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(400).json({ message: 'Unauthorized: No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    // Check if the user exists
    const user = await User.findById(decoded.id).select('_id email');
    if (!user) {
      res.status(401).json({ message: 'Unauthorized: User not found.' });
      return;
    }

    // Attach the user to the request object
    req.user = { id: user._id.toString()};

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token.' });
  }
};
