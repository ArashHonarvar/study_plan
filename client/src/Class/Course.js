/**
 * Constructor function for new Exam objects
 * @param {string} code course code (e.g., '01ABC')
 * @param {string} name course name
 * @param {number} credits number of credits (e.g., 6)
 * @param {number} max_students
 * @param {number} enrolled_students
 * @param {any} incompatible_courses
 * @param {number} preparatory_course
 */
 function Course(code, name, credits, max_students, enrolled_students, preparatory_course, preparatory_course_name = null, incompatible_courses = null) {
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.max_students = max_students;
    this.enrolled_students = enrolled_students;
    this.incompatible_courses = incompatible_courses;
    this.preparatory_course = preparatory_course;
    this.preparatory_course_name = preparatory_course_name;
}

export default Course;