# "StudyPlan" Project
Computer Engineering <br />
Polytechnic University of Turin <br />
WebApplication 1 course final project <br />
## Student: HONARVAR ARASH 

## React Client Application Routes

- Route `/`: Application Homepage - List of the all courses and studyPlan courses
- Route `/login`: Login page for the authentication
- Route `/add`: Adding a new studyPlan 
- Route `/add-course`: Add or remove courses from studyPlan

## API Server

- POST `/api/sessions`
  - request parameters and request body content
  ```
    {
        "username":"john.doe@polito.it",
        "password":"password"
    }
  ```
  - response body content
  ```
    {
        "id":1,
        "username":"john.doe@polito.it",
        "name":"John"
    }
  ```
- GET `/api/sessions/current`
  - request parameters and request body content : empty
  - response body content
  ```
    {
        "id":1,
        "username":"john.doe@polito.it",
        "name":"John"
    }
  ```
- DELETE `/api/sessions/current`
  - request parameters and request body content : empty
  - response body content : empty

- GET `/api/courses`
  - Return an array of courses containing all courses order by name
  - request parameters and request body content : empty
  - response body content
  ```
    [
      {
        "code": "01UDFOV",
        "name": "Applicazioni Web I ",
        "credits": 6,
        "max_students": null,
        "enrolled_students": 0,
        "incompatible_courses": [
            {
                "courseCode": "01UDFOV",
                "incompatibleCourseCode": "01TXYOV",
                "incompatibleCourseName": "Web Applications I "
            }
        ],
        "preparatory_course": null,
        "preparatory_course_name": null
      },{
        "code": "04GSPOV",
        "name": "Software engineering ",
        "credits": 6,
        "max_students": null,
        "enrolled_students": 2,
        "incompatible_courses": [
            {
                "courseCode": "04GSPOV",
                "incompatibleCourseCode": "05BIDOV",
                "incompatibleCourseName": "Ingegneria del software "
            }
        ],
        "preparatory_course": "02LSEOV",
        "preparatory_course_name": "Computer architectures  "
      }
    ]
  ```
- GET `/api/study-plan`
  - Get User StudyPlan Object from database
  - request parameters and request body content : credentials
  - response body content
  ```
    {
        "id": 1,
        "user": 1,
        "datetime":"2022-06-13 16:06",
        "type": "full-time"
    }
  ```

 - POST `/api/study-plan/courses`
  - Create StudyPlan Object(if needed) and remove all previous courses and add new courses to it
  - request parameters and request body content : credentials
  ```
    { "courses" :[
      {
        "code": "01UDFOV"
      },{
        "code": "02LSEOV"
      },{
        "code": "04GSPOV"
      },{
        "code": "01TXYOV"
      }
    ],
    "studyPlan" : {
        "id": null,
        "type": "full-time"
    }
    }
  ```
  - response body content: true

  - DELETE `/api/study-plan/:id`
  - request parameters and request body content : credentials , id of the studyPlan
  - response body content : true

## Database Tables

- Table `user` - storing user info 
  - id
  - name
  - email
  - password
  - salt
- Table `course` - storing list of courses
  - code
  - name
  - credits
  - max_students
  - preparatory_course
  - description
- Table `incompatibile_course` - list of incompatibilities between courses
  - course_code
  - incompatible_course_code 
- Table `study_plan` - storing the studyPlan type for the user
  - id
  - user
  - datetime
  - type
- Table `study_plan_course` - list of courses for each studyPlan of the users         
  - study_plan_id
  - course_code

## Main React Components

- `CourseList` (in `/components/CourseList.js`): 
  - It shows the full list of courses and also study-plan(if created and authenticated) within 2 tabs.
(All courses -  My Study Plan)
there are buttons to add a study plan(if not created) and also edit and remove the current study plan
- `AddStudyPlanForm` (in `/components/AddStudyPlanForm.js`): 
  - In this component, you can create a new studyPlan by selecting a type(full-time/part-time)
- `EditStudyPlan` (in `/components/EditStudyPlan.js`): 
  - The main functionality of adding and removing a course from studyPlan(Editing studyPlan) happens in this component. The validations for add or remove course are also in this component.
- `CourseListTable` (in `/components/CourseListTable.js`): 
  - All of the components that need to show a table for list of courses, use this component. It shows a table for list of courses
- `Login` (in `/components/Login.js`): The login page
- `Layout` (in `/components/Layout.js`): 
  - It is a layout for most of the pages with a navigation bar

## Users Credentials

- Username: `john.doe@polito.it` , Password: `password`
- Username: `mario.rossi@polito.it`, Password: `password`
- Username: `tom.hanks@polito.it`, Password: `password`
- Username: `jack.roberts@polito.it`, Password: `password`
- Username: `steven.gerrard@polito.it`, Password: `password`
