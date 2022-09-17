'use strict';

const { db } = require('../db');
const { Course } = require('../Class/Course');

// get all courses
exports.listCourses = () => {
  return new Promise((resolve, reject) => {
    // const sql = 'SELECT * FROM course';
    const sql = 'SELECT c.code,c.name,c.credits,c.max_students,c.preparatory_course, c2.name as preparatory_course_name , ( SELECT COUNT(*) FROM study_plan_course spc WHERE spc.course_code = c.code) as numberOfEnrolledStudents FROM course c LEFT JOIN course c2 ON c2.code = c.preparatory_course ORDER BY c.name';
    db.all(sql, [], (err, rows) => {
      if (err)
        reject(err);
      else {
        const courses = rows.map(row => new Course(row.code, row.name, row.credits, row.max_students, row.numberOfEnrolledStudents, row.preparatory_course, row.preparatory_course_name));
        resolve(courses);
      }
    });
  });
};

exports.getCourse = (courseCode) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT c.code,c.name,c.credits,c.max_students,c.preparatory_course, c2.name as preparatory_course_name, ( SELECT COUNT(*) FROM study_plan_course spc WHERE spc.course_code = c.code) as numberOfEnrolledStudents FROM course c LEFT JOIN course c2 ON c2.code = c.preparatory_course WHERE c.code = ?';
    db.get(sql, [courseCode], (err, row) => {
      if (err)
        reject(err);
      else {
        const course = new Course(row.code, row.name, row.credits, row.max_students, row.numberOfEnrolledStudents, row.preparatory_course, row.preparatory_course_name);
        resolve(course);
      }
    });
  });
};