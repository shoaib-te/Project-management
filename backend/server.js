// Corrected spelling
const dotenv = require('dotenv').config();

const http = require('http');
const app = require("./src/app");
const connectDB = require("./src/config/db");

const { serve } = require("inngest/express");
// Import your custom inngest client and functions array
const { inngest, functions } = require("./src/inngest");

const PORT = process.env.PORT || 5000;

// 1. Establish Database Connection
connectDB();

app.use("/api/inngest", serve({ client: inngest, functions }));

// 2. Create HTTP Server instances wrapping your Express app
const server = http.createServer(app);

// 3. Start Listening for Incoming Requests
server.listen(PORT, () => {
    console.log(` Server running  on port ${PORT}`);
});
