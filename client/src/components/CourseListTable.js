import { Table, Alert, Row } from "react-bootstrap";
import React from "react";
import CourseListRow from "./CourseListRow";

function CourseListTable(props) {

    let sumCredits = 0;
    let studyPlanCourseCodes = [];
    let errorMessagesCourseCodes = [];

    const maxCredits = props.studyPlanType === 'full-time' ? 80 : 40;
    const minCredits = props.studyPlanType === 'full-time' ? 60 : 20;
    if (props.mode && props.mode === "edit") {
        sumCredits = props.sumCredits;
        studyPlanCourseCodes = props.studyPlanCourses.map(function (course) {
            return course.code
        });
        errorMessagesCourseCodes = props.errorMessages.map(function (error) {
            return error.courseCode
        });       
    } else {
        sumCredits = props.courses.reduce((s, e) => (s + e.credits), 0);
    }

    return <>
        {sumCredits < minCredits && <Row>
            <Alert variant="warning">Your study-plan credits is less than minimum credits</Alert>
        </Row>}
        {sumCredits >= maxCredits && props.mode === "edit" && <Row>
            <Alert variant="info">Your study-plan is full</Alert>
        </Row>}
        <Table className='table-hover'>
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Title</th>
                    <th>Credits</th>
                    <th>Maximum # of students</th>
                    <th># of enrolled students</th>
                    {props.mode && props.mode === "edit" && props.loading === false && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {props.courses ? props.courses.map((course) => (
                    <CourseListRow
                        key={course.code}
                        course={course}
                        mode={props.mode}
                        loading={props.loading}
                        isFull={props.mode && props.mode === "edit" && sumCredits >= maxCredits ? true : false}
                        handleAddNewCourse={props.mode && props.mode === "edit" && props.handleAddNewCourse ? props.handleAddNewCourse : null}
                        handleRemoveCourse={props.mode && props.mode === "edit" && props.handleRemoveCourse ? props.handleRemoveCourse : null}
                        addedToStudyPlan={
                            props.mode && props.mode === "edit" && studyPlanCourseCodes && studyPlanCourseCodes.includes(course.code) ? true : false
                        }
                        hasError={
                            props.mode && props.mode === "edit" && errorMessagesCourseCodes && errorMessagesCourseCodes.includes(course.code) ? true : false
                        }
                        prepInStudyPlan={
                            props.mode && props.mode === "edit" && course.preparatory_course && props.studyPlanCourses.filter((addedCourse) => (addedCourse.code === course.preparatory_course)).length === 0 ? false : true
                        }
                    />))
                    :
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                }
            </tbody>
        </Table>
    </>
}


export default CourseListTable;