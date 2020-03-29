import express, { Express } from 'express';

import dotenv from 'dotenv';
dotenv.config();

import middewares from './middlewares';
import './database';

// importing routes
import authRoutes from './routes/auth.routing';
import indexRoutes from './routes/index.routing';
import userRoutes from './routes/users.routing';
import topicRoutes from './routes/topic.routing';
import commentRoutes from './routes/comment.routing';

const app: Express = express();

// middlewares
middewares(app);

// routes
app.use('/api', authRoutes);
app.use('/api', indexRoutes);
app.use('/api', userRoutes);
app.use('/api', topicRoutes);
app.use('/api', commentRoutes);

export default app;
