import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import CourseList from './components/CourseList';
import courseAPI from './API/courseAPI';
import userAPI from './API/userAPI';
import studyPlanAPI from './API/studyPlanAPI';
import { Col, Row, Spinner } from 'react-bootstrap';
import Login from './components/Login';
import AddStudyPlanForm from './components/AddStudyPlanForm';
import EditStudyPlan from './components/EditStudyPlan';

function App() {

  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [studyPlanCourses, setStudyPlanCourses] = useState([]);
  const [studyPlanCourseCodes, setStudyPlanCourseCodes] = useState([]);
  const [studyPlan, setStudyPlan] = useState(null);
  const [studyPlanType, setStudyPlanType] = useState(null);
  const [sumCredits, setSumCredits] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const getAllCourses = async () => {
    try {
      const courses = await courseAPI.getAllCourses();
      setCourses(courses);
    } catch (error) {
      console.log(error.code);
    }
  };

  const getStudyPlan = async () => {
    try {
      let studyPlan = await studyPlanAPI.getUserStudyPlan();
      setStudyPlan(studyPlan);
      if (studyPlan) {
        setStudyPlanType(studyPlan.type);
        let studyPlanCourses = await studyPlanAPI.getUserStudyPlanCourses(studyPlan.id);
        setStudyPlanCourses(studyPlanCourses);
        setStudyPlanCourseCodes(studyPlanCourses.map(function (course) {
          return course.code
        }));
        setSumCredits(studyPlanCourses.reduce((s, e) => (s + e.credits), 0));
      } else {
        setStudyPlanType(null);
        setStudyPlanCourses([]);
        setStudyPlanCourseCodes([]);
        setSumCredits(0);
      }
    }
    catch (err) {
      console.log(err.code);
    }
  };



  useEffect(() => {
    const checkAuth = async () => {
      try {
        let user = await userAPI.getUserInfo(); // we have the user info here
        setUser(user);
        setLoggedIn(true);
      } catch (error) {
        setLoading(false);
      }
    };
    checkAuth();
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    getAllCourses();
    if (loggedIn) {
      getStudyPlan();
    }
    setLoading(false);
  }, [loggedIn]);


  const handleLogin = async (credentials) => {
    try {
      const user = await userAPI.logIn(credentials);
      setLoggedIn(true);
      setUser(user);
      setMessage({ message: `Welcome, ${user.name}!`, type: 'success' });
      setTimeout(() => {
        setMessage("");
      }, 4000);
    }
    catch (err) {
      setMessage({ message: `Incorrect username or password`, type: 'danger' });
    }
  };

  const handleLogout = async () => {
    await userAPI.logOut();
    setLoggedIn(false);
    // clean up everything
    setCourses([]);
    setStudyPlan(null);
    setStudyPlanType(null);
    setStudyPlanCourses([]);
    setStudyPlanCourseCodes([]);
    setSumCredits(0);
    setMessage('');
  };

  if (loading === true) {
    return <>
      <Row>
        <Col></Col>
        <Col>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Col>
      </Row>
    </>
  }


  return (
    <Router>
      <Routes>
        <Route path='/login' element={
          loggedIn ? <Navigate replace to='/' /> : <Login message={message} setMessage={setMessage} login={handleLogin} />
        } />
        <Route path='/' element={<Layout user={user} logout={handleLogout} loggedIn={loggedIn} />} >
          <Route path='' element={<CourseList studyPlanType={studyPlanType} message={message} setMessage={setMessage} loading={loading} setLoading={setLoading} sumCredits={sumCredits} courses={courses} studyPlan={studyPlan} studyPlanCourses={studyPlanCourses} getAllCourses={getAllCourses} getStudyPlan={getStudyPlan} />} />
          <Route path='/add' element={loggedIn ? <AddStudyPlanForm setStudyPlanType={setStudyPlanType} setStudyPlan={setStudyPlan} /> : <Navigate replace to='/login' />} ></Route>
          <Route path='/add-course' element={loggedIn ? <EditStudyPlan setMessage={setMessage} setLoading={setLoading} studyPlanType={studyPlanType} addedStudyPlanCourseCodes={studyPlanCourseCodes} sumCredits={sumCredits} setSumCredits={setSumCredits} courses={courses} studyPlan={studyPlan} studyPlanCourses={studyPlanCourses} setStudyPlanCourses={setStudyPlanCourses} getAllCourses={getAllCourses} getStudyPlan={getStudyPlan} /> : <Navigate replace to='/login' />} ></Route>
        </Route>
        <Route path='*' element={<h3 className='text-center'> 404 ERROR - This page does not exist </h3>} ></Route>
      </Routes>
    </Router>
  );
}

export default App;
