'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword = await bcrypt.hash('123456', 10);

    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin User',
        avatar: null,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'user@example.com',
        password: hashedPassword,
        name: 'Demo User',
        avatar: null,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', {
      email: ['admin@example.com', 'user@example.com'],
    });
  },
};
