// Kết nối database MySQL bằng Sequelize
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Tạo instance Sequelize từ biến môi trường (.env)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    // Chỉ log SQL query ở môi trường development để dễ debug
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

export default sequelize;
