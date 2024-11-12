require('dotenv').config({path:'../.env'});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cron = require('node-cron');


dotenv.config();

const app = express();


mongoose.connect('mongodb://localhost:27017/PomDu',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Cấu hình CORS
app.use(cors({
  origin: 'http://localhost:3000', // Thay đổi thành URL của frontend của bạn
  credentials: true
}));

app.get('/api', (req, res) => {
    res.send('API is working!');
  });
  
const PORT = process.env.NODE_LOCAL_PORT || 7070;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Đã xảy ra lỗi server', error: err.message });
});


module.exports = app;