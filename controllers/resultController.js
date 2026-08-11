const { validationResult } = require('express-validator');
const { Result, User } = require('../models');

const computeSubjectTotal = (mse, ese) => (mse * 0.3 + ese * 0.7);
const computeCgpa = (marks) => {
  const percentage = marks / 4;
  if (percentage >= 90) return 10.0;
  if (percentage >= 80) return 9.0;
  if (percentage >= 70) return 8.0;
  if (percentage >= 60) return 7.0;
  if (percentage >= 50) return 6.0;
  if (percentage >= 40) return 5.0;
  return 0.0;
};
const computeGrade = (marks) => {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B';
  if (marks >= 60) return 'C';
  if (marks >= 50) return 'D';
  if (marks >= 40) return 'E';
  return 'F';
};

const createOrUpdateResult = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    studentId,
    subject1MSE,
    subject1ESE,
    subject2MSE,
    subject2ESE,
    subject3MSE,
    subject3ESE,
    subject4MSE,
    subject4ESE,
  } = req.body;

  try {
    const student = await User.findOne({ where: { studentId, role: 'student' } });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const subject1Total = computeSubjectTotal(subject1MSE, subject1ESE);
    const subject2Total = computeSubjectTotal(subject2MSE, subject2ESE);
    const subject3Total = computeSubjectTotal(subject3MSE, subject3ESE);
    const subject4Total = computeSubjectTotal(subject4MSE, subject4ESE);
    const finalMarks = subject1Total + subject2Total + subject3Total + subject4Total;
    const grade = computeGrade(finalMarks / 4);
    const cgpa = computeCgpa(finalMarks);
    const status = [subject1Total, subject2Total, subject3Total, subject4Total].every((tot) => tot >= 12) ? 'pass' : 'fail';

    const [result] = await Result.upsert({
      studentId,
      subject1MSE,
      subject1ESE,
      subject2MSE,
      subject2ESE,
      subject3MSE,
      subject3ESE,
      subject4MSE,
      subject4ESE,
      subject1Total,
      subject2Total,
      subject3Total,
      subject4Total,
      finalMarks,
      cgpa,
      grade,
      status,
    });

    res.status(201).json({ message: 'Result saved', result });
  } catch (error) {
    res.status(500).json({ error: 'Unable to save result' });
  }
};

const getResults = async (req, res) => {
  const { query } = req;
  try {
    const where = {};
    if (query.studentId) where.studentId = query.studentId;
    if (query.status) where.status = query.status;
    if (query.grade) where.grade = query.grade;

    const results = await Result.findAll({ where, order: [['updatedAt', 'DESC']] });
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch results' });
  }
};

const getResultByStudent = async (req, res) => {
  const { role, studentId } = req.user;
  const requestedStudentId = req.params.studentId;

  if (role === 'student' && studentId !== requestedStudentId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const result = await Result.findOne({ where: { studentId: requestedStudentId } });
    if (!result) return res.status(404).json({ error: 'Result not found' });
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch result' });
  }
};

const deleteResult = async (req, res) => {
  const { id } = req.params;
  try {
    const count = await Result.destroy({ where: { id } });
    if (!count) return res.status(404).json({ error: 'Result not found' });
    res.json({ message: 'Result deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete result' });
  }
};

module.exports = { createOrUpdateResult, getResults, getResultByStudent, deleteResult };
