// Corrected spelling
import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './src/app.js';
import connectDB from './src/config/db.js';

import { serve } from 'inngest/express';
// Import your custom inngest client and functions array
import { inngest, functions } from './src/inngest/index.js';

const PORT = process.env.PORT || 5000;

// 1. Establish Database Connection
connectDB();

app.use('/api/inngest', serve({ client: inngest, functions }));

// 2. Create HTTP Server instances wrapping your Express app
const server = http.createServer(app);

// 3. Start Listening for Incoming Requests
server.listen(PORT, () => {
  console.log(` Server running  on port ${PORT}`);
});
