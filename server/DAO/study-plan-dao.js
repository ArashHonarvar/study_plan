'use strict';

const { Course } = require('../Class/Course');
const { db } = require('../db');

exports.addStudyPlan = (studyPlan, userId) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO study_plan( user, datetime, type) VALUES (?,?,?)";;
    db.run(sql, [userId, studyPlan.datetime, studyPlan.type],
      function (err, row) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      }
    );
  });
}

exports.addStudyPlanCourse = (studyPlanId, courseCode) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO study_plan_course( study_plan_id, course_code ) VALUES (?,?)";
    db.run(sql, [studyPlanId, courseCode],
      err => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
  });
}

exports.isCourseInStudyPlan = (studyPlanId, courseCode) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT COUNT(*) N FROM study_plan_course WHERE study_plan_id = ? AND course_code = ?";
    db.get(sql, [studyPlanId, courseCode],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.N > 0 ? true : false);
        }
      });
  });
}

exports.getUserStudyPlan = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM study_plan WHERE user = ?';
    db.get(sql, [userId], (err, row) => {
      if (err)
        reject(err);
      else {
        resolve(row);
      }
    });
  });
};

exports.getUserStudyPlanCourses = (studyPlanId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT c.code,c.name,c.credits,c.max_students,c.preparatory_course,c2.name as preparatory_course_name, ( SELECT COUNT(*) FROM study_plan_course spco WHERE spco.course_code = c.code) as numberOfEnrolledStudents FROM study_plan_course spc INNER JOIN course c ON spc.course_code = c.code LEFT JOIN course c2 ON c2.code = c.preparatory_course WHERE study_plan_id = ? ORDER BY c.name';
    db.all(sql, [studyPlanId], (err, rows) => {
      if (err)
        reject(err);
      else {
        const courses = rows.map(row => new Course(row.code, row.name, row.credits, row.max_students, row.numberOfEnrolledStudents, row.preparatory_course, row.preparatory_course_name));
        resolve(courses);
      }
    });
  });
};


exports.getCoursesOfPreparatoryCourse = (studyPlanId, courseCode) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM study_plan_course spc INNER JOIN course c ON spc.course_code = c.code WHERE spc.study_plan_id = ? AND c.preparatory_course = ?';
    db.all(sql, [studyPlanId, courseCode], (err, rows) => {
      if (err)
        reject(err);
      else {
        const courses = rows.map(row => new Course(row.code, row.name, row.credits, null, row.preparatory_course));
        resolve(courses);
      }
    });
  });
};

exports.removeStudyPlanCourse = (studyPlanId, courseCode) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM study_plan_course WHERE study_plan_id = ? AND course_code = ?';
    db.run(sql, [studyPlanId, courseCode], (err) => {
      if (err)
        reject(err);
      else {
        resolve(true);
      }
    });
  });
};

exports.removeAllStudyPlanCourses = (studyPlanId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM study_plan_course WHERE study_plan_id = ?';
    db.run(sql, [studyPlanId], (err) => {
      if (err)
        reject(err);
      else {
        resolve(true);
      }
    });
  });
};

exports.removeStudyPlan = (studyPlanId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM study_plan WHERE id = ?';
    db.run(sql, [studyPlanId], (err) => {
      if (err)
        reject(err);
      else {
        resolve(true);
      }
    });
  });
};

exports.getUserStudyPlanCredits = (studyPlanId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT SUM(c.credits) as SUM FROM study_plan_course spc INNER JOIN course c ON spc.course_code = c.code WHERE spc.study_plan_id = ?';
    db.get(sql, [studyPlanId], (err, row) => {
      if (err)
        reject(err);
      else {
        resolve(row.SUM);
      }
    });
  });
};