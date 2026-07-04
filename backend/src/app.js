const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect your auth router with a clear prefix URL
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);


module.exports=app 
