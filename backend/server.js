import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './src/app.js';
import connectDB from './src/config/db.js';

import { serve } from 'inngest/express';
import { inngest, functions } from './src/inngest/index.js';

const PORT = process.env.PORT || 5000;

connectDB();
app.use('/api/inngest', serve({ client: inngest, functions }));

if (!process.env.VERCEL) {
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
