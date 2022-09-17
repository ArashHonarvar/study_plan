import Course from '../Class/Course';

const SERVER_URL = 'http://localhost:3001/api/';

const getAllCourses = async () => {
    const response = await fetch(SERVER_URL + 'courses',
        {
            credentials: 'include',
        }
    );
    const coursesJson = await response.json();
    if (response.ok) {
        return coursesJson.map(c => new Course(c.code, c.name, c.credits, c.max_students, c.enrolled_students, c.preparatory_course, c.preparatory_course_name, c.incompatible_courses));
    }
    else
        throw coursesJson;
};


const courseAPI = { getAllCourses };
export default courseAPI;