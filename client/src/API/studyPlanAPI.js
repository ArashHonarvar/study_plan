
const SERVER_URL = 'http://localhost:3001/api/';

const getUserStudyPlan = async () => {
    const response = await fetch(SERVER_URL + 'study-plan',
        {
            credentials: 'include',
        }
    );
    const studyPlanJson = await response.json();
    if (response.ok) {
        return studyPlanJson;
    }
    else
        throw studyPlanJson;
};


const addStudyPlanCourses = async (studyPlan, courses) => {
    let studyPlanCourses = { "courses": courses , "studyPlan" : studyPlan };
    const response = await fetch(SERVER_URL + 'study-plan/courses',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studyPlanCourses),
            credentials: 'include',
        }
    );
    const studyPlanJson = await response.json();
    if (response.ok) {
        return studyPlanJson;
    }
    else
        throw studyPlanJson;
};



const removeStudyPlan = async (studyPlanId) => {
    const response = await fetch(SERVER_URL + 'study-plan/' + studyPlanId,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: [],
            credentials: 'include',
        }
    );
    const studyPlanJson = await response.json();
    if (response.ok) {
        return studyPlanJson;
    }
    else
        throw studyPlanJson;
};

const getUserStudyPlanCourses = async (studyPlanId) => {
    const response = await fetch(SERVER_URL + "study-plan/" + studyPlanId + "/courses",
        {
            credentials: 'include',
        }
    );
    const studyPlanCoursesJson = await response.json();
    if (response.ok) {
        return studyPlanCoursesJson;
    }
    else
        throw studyPlanCoursesJson;
};



const courseAPI = { getUserStudyPlan, removeStudyPlan, addStudyPlanCourses, getUserStudyPlanCourses };
export default courseAPI;