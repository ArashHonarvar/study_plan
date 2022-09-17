'use strict';

const { db } = require('../db');
const { IncompatibleCourse } = require('../Class/IncompatibleCourse');

// get all courses
exports.listIncompatibleCoursesByCourseCode = (courseCode) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT *,c.name as incompatibile_course_name FROM incompatibile_course ic LEFT JOIN course c ON ic.incompatible_course_code = c.code  WHERE ic.course_code = ?';
    db.all(sql, [courseCode], (err, rows) => {
      if (err)
        reject(err);
      else {
        const IncompatibleCourses = rows.map(row => new IncompatibleCourse(row.course_code, row.incompatible_course_code, row.incompatibile_course_name));
        resolve(IncompatibleCourses);
      }
    });
  });
};