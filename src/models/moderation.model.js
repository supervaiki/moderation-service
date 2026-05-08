const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Moderation = sequelize.define('Moderation', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  annonceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true // On ne modère pas deux fois la même annonce
  },
  status: {
    type: DataTypes.ENUM('APPROUVEE', 'REJETEE'),
    allowNull: false
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Moderation;