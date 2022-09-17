'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const cors = require('cors');
const dayjs = require('dayjs'); 
const { body, validationResult, param } = require('express-validator');

//DAO
const courseDao = require('./DAO/course-dao');
const incompatibleCourseDao = require('./DAO/incompatible-course-dao');
const userDao = require('./DAO/user-dao');
const studyPlanDao = require('./DAO/study-plan-dao');

// Passport-related imports
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const { IncompatibleCourse } = require('./Class/IncompatibleCourse');

// init express
const app = express();
const port = 3001;
const PATH = "/api/";

// set up the middlewares
app.use(morgan('dev'));
app.use(express.json()); // for parsing json request body
// set up and enable cors
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));
// Student API

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await userDao.getUser(username, password)
  if (!user)
    return cb(null, false, 'Incorrect username or password.');

  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user is id + email + name
  return cb(null, user);
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
}

const isValidated = async (req, res, next) => {
  const body = req.body;
  const courses = body.courses;
  let studyPlanBody = body.studyPlan;
  let sumCredits = 0;
  let studyPlanObject = null;
  let studyPlanCourses = [];

  
  if (studyPlanBody.id === null) {
    studyPlanObject = studyPlanBody;
  } else {
    studyPlanObject = await studyPlanDao.getUserStudyPlan(req.user.id);
    studyPlanCourses = await studyPlanDao.getUserStudyPlanCourses(studyPlanObject.id);
  }

  const maxCredits = studyPlanObject.type === 'full-time' ? 80 : 40;
  const minCredits = studyPlanObject.type === 'full-time' ? 60 : 20;
  let errors = [];
  let hasError = false;

  for (let newCourse of courses) {
    let courseCode = newCourse.code;
    let courseObj = await courseDao.getCourse(courseCode);
    sumCredits = sumCredits + courseObj.credits;
    let listIncompatibleCourses = await incompatibleCourseDao.listIncompatibleCoursesByCourseCode(courseCode);

    //check incompatibility
    for (let incompatibleCourse of listIncompatibleCourses) {
      let courseForCheck = courses.filter((course) => (course.code == incompatibleCourse.incompatibleCourseCode))[0];
      if (courseForCheck) {
        hasError = true;
        errors.push({ courseCode: null, type: "danger", message: "Incompatible Course " + courseForCheck.code + " was added!" });
      }
    }

    //check preparatory
    let preparatory = courseObj.preparatory_course;
    if (preparatory) {
      let courseForCheck = courses.filter((course) => (course.code == preparatory))[0];
      if (!courseForCheck) {
        hasError = true;
        errors.push({ courseCode: null, type: "danger", message: "Preparatory Course " + preparatory + " is needed!" });
      }
    }

    //check # of enrolled students
    let isCourseInStudyPlanFromBefore = studyPlanCourses.map(course => course.code).indexOf(courseCode) === -1;
    if (isCourseInStudyPlanFromBefore && courseObj.max_students && courseObj.enrolled_students + 1 > courseObj.max_students) {
      hasError = true;
      errors.push({ courseCode: null, type: "danger", message: "Course " + courseCode + " has reached the maximum numebr of students!" });
    }

    if (errors.length > 0) {
      return res.status(401).json(errors);
    }
  }

  //check max-min credits
  if (sumCredits > maxCredits) {
    hasError = true;
    errors.push({ courseCode: null, type: "danger", message: "Your study-plan is more than maximum credits!" });
  }

  if (sumCredits < minCredits) {
    hasError = true;
    errors.push({ courseCode: null, type: "danger", message: "Your study-plan is less than minimum credits!" });
  }

  if (errors.length > 0) {
    return res.status(401).json(errors);
  } else {
    return next();
  }
}

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


/* If we aren't interested in sending error messages... */
app.post(PATH + 'sessions', passport.authenticate('local'), (req, res) => {
  res.status(201).json(req.user);
});

// GET /api/sessions/current
app.get(PATH + 'sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  }
  else
    res.status(401).json({ error: 'Not authenticated' });
});

// DELETE /api/session/current
app.delete(PATH + 'sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});


// Course API
app.get(PATH + 'courses', async (request, response) => {
  try {
    let courses = await courseDao.listCourses();
    for (let course of courses) {
      let list = await incompatibleCourseDao.listIncompatibleCoursesByCourseCode(course.code);
      course.incompatible_courses = list;
    }
    return response.json(courses);
  } catch (error) {
    return response.status(500).end(error.name);
  }
});

// Study Plan API

app.get(PATH + 'study-plan', isLoggedIn, async (request, response) => {
  try {
    let studyPlan = await studyPlanDao.getUserStudyPlan(request.user.id);
    if (studyPlan) {
      return response.json(studyPlan);
    } else {
      return response.json(null);
    }
  } catch (error) {
    return response.status(500).end(error.name);
  }
});


app.post(PATH + 'study-plan/courses', isLoggedIn,
  body("courses").notEmpty(),
  body("studyPlan").notEmpty(),
  body("courses").isArray(),
  isValidated,
  async (request, response) => {
    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
      return res.status(422).json("ERROR: Unprocessable Entity");
    }

    const body = request.body;
    const courses = body.courses;
    let studyPlan = body.studyPlan;
    let studyPlanId = body.studyPlan.id;
    let errors = [];
    if (studyPlan.id !== null) {
      try {
        await studyPlanDao.removeAllStudyPlanCourses(studyPlan.id);
      } catch (error) {
        return response.status(500).end(error.name);
      }
    } else {
      studyPlan.datetime = dayjs().format("YYYY-MM-DD HH:MM");
      studyPlanId = await studyPlanDao.addStudyPlan(studyPlan, request.user.id);
    }

    for (let newCourse of courses) {
      let courseCode = newCourse.code;
      try {
        await studyPlanDao.addStudyPlanCourse(studyPlanId, courseCode);
      } catch (error) {
        errors.push({ courseCode: null, type: "danger", message: "Server Error!" });
        return response.status(500).end(JSON.stringify(errors));
      }
    }

    if (errors.length > 0) {
      return response.status(422).end(JSON.stringify(errors));
    } else {
      return response.json(true);
    }
  });

app.delete(PATH + 'study-plan/:id', isLoggedIn, async (request, response) => {

  const validationErrors = validationResult(request);
  if (!validationErrors.isEmpty()) {
    return res.status(422).json("ERROR: Unprocessable Entity");
  }

  const body = request.body;
  let studyPlanId = request.params.id;
  try {
    await studyPlanDao.removeAllStudyPlanCourses(studyPlanId);
    await studyPlanDao.removeStudyPlan(studyPlanId);
    return response.json(true);
  } catch (error) {
    return response.status(500).end(error.name);
  }
});


app.get(PATH + 'study-plan/:id/courses', isLoggedIn, param("id").isInt({ min: 0 }), async (request, response) => {

  const validationErrors = validationResult(request);
  if (!validationErrors.isEmpty()) {
    return res.status(422).json("ERROR: Unprocessable Entity");
  }

  try {
    let studyPlanId = request.params.id;
    let studyPlanCourses = await studyPlanDao.getUserStudyPlanCourses(studyPlanId);
    for (let course of studyPlanCourses) {
      let list = await incompatibleCourseDao.listIncompatibleCoursesByCourseCode(course.code);
      course.incompatible_courses = list;
    }
    return response.json(studyPlanCourses);
  } catch (error) {
    return response.status(500).end(error.name);
  }
});

/*** Other express-related instructions ***/

// activate the server
app.listen(port, () => console.log(`Server started at http://localhost:${port}.`));