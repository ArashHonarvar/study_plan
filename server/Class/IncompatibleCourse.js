'use strict';

/**
 * Constructor function for new Exam objects
 * @param {string} code course code (e.g., '01ABC')
 * @param {string} incompatibleCourseCode  course code (e.g., '01ABC')
 */
function IncompatibleCourse(courseCode, incompatibleCourseCode, incompatibleCourseName) {
    this.courseCode = courseCode;
    this.incompatibleCourseCode = incompatibleCourseCode;
    this.incompatibleCourseName = incompatibleCourseName;
}

exports.IncompatibleCourse = IncompatibleCourse;