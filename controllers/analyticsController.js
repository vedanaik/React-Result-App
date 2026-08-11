const { Result } = require('../models');

const getAnalytics = async (req, res) => {
  try {
    const totalResults = await Result.count();
    const passCount = await Result.count({ where: { status: 'pass' } });
    const failCount = await Result.count({ where: { status: 'fail' } });
    const averageCgpaRow = await Result.findOne({ attributes: [[Result.sequelize.fn('AVG', Result.sequelize.col('cgpa')), 'averageCgpa']] });
    const averageCgpa = parseFloat(averageCgpaRow.dataValues.averageCgpa || 0).toFixed(2);

    res.json({ totalResults, passCount, failCount, averageCgpa });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch analytics' });
  }
};

module.exports = { getAnalytics };
