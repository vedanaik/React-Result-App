const { DataTypes } = require('sequelize');
const { sequelize } = require('./utils/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'faculty', 'student'), allowNull: false },
  department: { type: DataTypes.STRING },
  studentId: { type: DataTypes.STRING, unique: true, allowNull: true },
});

const Result = sequelize.define('Result', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  studentId: { type: DataTypes.STRING, allowNull: false },
  subject1MSE: { type: DataTypes.INTEGER, allowNull: false },
  subject1ESE: { type: DataTypes.INTEGER, allowNull: false },
  subject2MSE: { type: DataTypes.INTEGER, allowNull: false },
  subject2ESE: { type: DataTypes.INTEGER, allowNull: false },
  subject3MSE: { type: DataTypes.INTEGER, allowNull: false },
  subject3ESE: { type: DataTypes.INTEGER, allowNull: false },
  subject4MSE: { type: DataTypes.INTEGER, allowNull: false },
  subject4ESE: { type: DataTypes.INTEGER, allowNull: false },
  subject1Total: { type: DataTypes.FLOAT, allowNull: false },
  subject2Total: { type: DataTypes.FLOAT, allowNull: false },
  subject3Total: { type: DataTypes.FLOAT, allowNull: false },
  subject4Total: { type: DataTypes.FLOAT, allowNull: false },
  finalMarks: { type: DataTypes.FLOAT, allowNull: false },
  cgpa: { type: DataTypes.FLOAT, allowNull: false },
  grade: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('pass', 'fail'), allowNull: false },
});

User.hasMany(Result, { foreignKey: 'studentId', sourceKey: 'studentId' });
Result.belongsTo(User, { foreignKey: 'studentId', targetKey: 'studentId' });

module.exports = { User, Result };
