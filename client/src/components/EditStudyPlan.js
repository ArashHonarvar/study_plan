import { Button, Col, Row, Alert, Modal, Spinner } from 'react-bootstrap'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studyPlanAPI from '../API/studyPlanAPI';
import CourseListTable from './CourseListTable';
import StudyPlanCreditHeader from './StudyPlanCreditHeader';

function EditStudyPlan(props) {

    const [showModal, setShowModal] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [loadingStudyPlan, setLoadingStudyPlan] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const addNewCourse = (course) => {
        const newCourse = { 'code': course.code, 'name': course.name, 'credits': course.credits, 'max_students': course.max_students, "enrolled_students": course.enrolled_students, "preparatory_course": course.preparatory_course, "incompatible_courses": course.incompatible_courses, "added": false };
        props.studyPlanCourses.push(newCourse);
        props.setStudyPlanCourses(props.studyPlanCourses);
        props.setSumCredits(props.sumCredits + course.credits);
        setErrorMessages([]);

    }

    const removeCourse = (course) => {
        let newStudyPlanCourses = props.studyPlanCourses.filter((c) => (c.code !== course.code));
        props.setStudyPlanCourses(newStudyPlanCourses);
        props.setSumCredits(props.sumCredits - course.credits);
        setErrorMessages([]);
    }

    const maxCredits = props.studyPlanType === 'full-time' ? 80 : 40;
    const minCredits = props.studyPlanType === 'full-time' ? 60 : 20;

    const handleAddNewCourse = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        let hasError = false;
        let errors = [];
        let courseCode = event.currentTarget.id;
        let courseObj = props.courses.filter((course) => (course.code === courseCode))[0];
        //check incompatibility
        for (let incompatibleCourse of courseObj.incompatible_courses) {
            let courseForCheck = props.studyPlanCourses.filter((course) => (course.code === incompatibleCourse.incompatibleCourseCode))[0];
            if (courseForCheck) {
                hasError = true;
                errors.push({ courseCode: courseCode, type: "danger", message: `Course ${courseObj.code + "-" + courseObj.name} is incompatible with ${courseForCheck.code + "-" + courseForCheck.name}` });
            }
        }
        //check preparatory
        let preparatory = courseObj.preparatory_course;
        let preparatory_name = courseObj.preparatory_course_name;
        if (preparatory) {
            let courseForCheck = props.studyPlanCourses.filter((course) => (course.code === preparatory))[0];
            if (!courseForCheck) {
                hasError = true;
                errors.push({ courseCode: courseCode, type: "danger", message: "Preparatory Course " + preparatory + "-" + preparatory_name + " is needed!" });
            }
        }

        //check max-min credits
        if (props.sumCredits + courseObj.credits > maxCredits) {
            hasError = true;
            errors.push({ courseCode: courseCode, type: "danger", message: "Your study-plan with " + courseObj.code + "-" + courseObj.name + " is more than maximum credits!" });
        }

        //check # of enrolled students
        let courseInStudyPlanFromBefore = props.addedStudyPlanCourseCodes.filter((code) => (code === courseCode))[0];
        if (!courseInStudyPlanFromBefore && courseObj.max_students && courseObj.enrolled_students + 1 > courseObj.max_students) {
            hasError = true;
            errors.push({ courseCode: courseCode, type: "danger", message: "Course " + courseObj.code + '-' + courseObj.name + " has reached the maximum numebr of students!" });
        }

        if (hasError === true) {
            setErrorMessages(errors);
            handleShowModal();
        } else {
            addNewCourse(courseObj);
        }
    }

    const handleRemoveCourse = async (event) => {

        event.preventDefault();
        event.stopPropagation();
        let hasError = false;
        let errors = [];
        let courseCode = event.currentTarget.id.replace('delete-', '');
        let courseObj = props.courses.filter((course) => (course.code === courseCode))[0];

        //check preparatory
        let coursesForCheck = props.studyPlanCourses.filter((course) => (course.preparatory_course === courseCode));
        for (let course of coursesForCheck) {
            hasError = true;
            errors.push({ courseCode: courseCode, type: "danger", message: "Course " + courseObj.code + "-" + courseObj.name + " is preparatory for " + course.code + "-" + course.name });
        }

        if (hasError === true) {
            setErrorMessages(errors);
            handleShowModal();
        } else {
            removeCourse(courseObj);
        }
    }

    const handleSaveStudyPlan = async (event) => {
        const studyPlanCourses = props.studyPlanCourses;
        try {
            setLoadingStudyPlan(true);
            const newStudyPlanCourseCodes = studyPlanCourses.map(function (course) {
                return { code: course.code }
            });
            await studyPlanAPI.addStudyPlanCourses(props.studyPlan, newStudyPlanCourseCodes);
            props.getAllCourses();
            props.getStudyPlan();
            setErrorMessages([]);
            setLoadingStudyPlan(false);
            props.setMessage("");
            handleNavigation("/");
        } catch (errors) {
            setErrorMessages(errors);
            props.setMessage(errors[0]);
            setLoadingStudyPlan(false);
            props.getAllCourses();
            props.getStudyPlan();
            handleNavigation("/");
        }
    }

    const handleCancelStudyPlan = async (event) => {
        props.setLoading(true);
        props.getAllCourses();
        props.getStudyPlan();
        setErrorMessages([]);
        props.setLoading(false);
        handleNavigation("/");
    }



    return <>
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title style={{ color: "red" }}>Error <i className="bi bi-exclamation-triangle-fill"></i></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorMessages.map((error, index) => (
                    <p key={index}>{error.message}</p>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleCloseModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
        <StudyPlanCreditHeader sumCredits={props.sumCredits} courses={props.studyPlanCourses} studyPlanType={props.studyPlanType} setErrorMessages={setErrorMessages} errorMessages={errorMessages} mode="edit" />
        <SaveCancelButtons loading={loadingStudyPlan} sumCredits={props.sumCredits} maxCredits={maxCredits} minCredits={minCredits} handleCancelStudyPlan={handleCancelStudyPlan} handleSaveStudyPlan={handleSaveStudyPlan} />
        {
            errorMessages &&
            errorMessages.map((error, index) => (
                <Row key={"error" + index}>
                    <Alert variant={error.type}>{error.message}</Alert>
                </Row>
            ))
        }
        <CourseListTable loading={loadingStudyPlan} errorMessages={errorMessages} studyPlanCourses={props.studyPlanCourses} sumCredits={props.sumCredits} studyPlanType={props.studyPlanType} courses={props.courses} mode="edit" handleAddNewCourse={handleAddNewCourse} handleRemoveCourse={handleRemoveCourse} />
        <SaveCancelButtons loading={loadingStudyPlan} sumCredits={props.sumCredits} maxCredits={maxCredits} minCredits={minCredits} handleCancelStudyPlan={handleCancelStudyPlan} handleSaveStudyPlan={handleSaveStudyPlan} />
    </>
}

function SaveCancelButtons(props) {
    return <>
        {props.loading === false &&
            <Row style={{ marginBottom: 10 }}>
                <Col>
                    {props.sumCredits <= props.maxCredits && props.sumCredits >= props.minCredits && <Button onClick={props.handleSaveStudyPlan} variant="success" style={{ marginRight: 10 }}>Save</Button>}
                    <Button variant="danger" onClick={props.handleCancelStudyPlan}>Cancel</Button>
                </Col>
            </Row>}
        {props.loading === true && <Row style={{ marginBottom: 10 }}>
            <Col>
                <Button variant="success" disabled>
                    <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                    Loading...
                </Button>
            </Col>
        </Row>}
    </>
}

export default EditStudyPlan;