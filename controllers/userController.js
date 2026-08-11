const { Result, User } = require('../models');

const getDashboard = async (req, res) => {
  const { role, studentId } = req.user;
  try {
    if (role === 'admin') {
      const totalStudents = await User.count({ where: { role: 'student' } });
      const totalFaculty = await User.count({ where: { role: 'faculty' } });
      const totalResults = await Result.count();
      return res.json({ role, totalStudents, totalFaculty, totalResults });
    }

    if (role === 'faculty') {
      const results = await Result.findAll({ limit: 10, order: [['updatedAt', 'DESC']] });
      return res.json({ role, recentResults: results });
    }

    if (role === 'student') {
      const result = await Result.findOne({ where: { studentId } });
      return res.json({ role, result });
    }

    res.status(400).json({ error: 'Invalid role' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch dashboard' });
  }
};

module.exports = { getDashboard };
