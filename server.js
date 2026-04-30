// File khởi động server - Điểm vào (entry point) của ứng dụng
import dotenv from 'dotenv';
dotenv.config(); // Load biến môi trường từ file .env vào process.env

import app from './app.js';
import { sequelize } from './models/index.js';

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    // Kiểm tra kết nối database trước khi start server
    await sequelize.authenticate();
    console.log('Connected to database');

    // Khởi động HTTP server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // Thoát ứng dụng nếu không kết nối được DB
  }
};

start();
