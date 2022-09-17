import { Table, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import React, { useState } from "react";

function CourseListRow(props) {

    const [expanded, setExpanded] = useState(false);

    let incompatible_courses = [];
    for (let incompatible_course of props.course.incompatible_courses) {
        incompatible_courses.push({ 'name': incompatible_course.incompatibleCourseCode + "-" + incompatible_course.incompatibleCourseName })
    }

    let colorClass = null;
    if (props.addedToStudyPlan === true) {
        colorClass = "table-success";
    }
    if (props.hasError === true) {
        colorClass = "table-danger";
    }

    let nameColorClass = null;
    if (props.mode && props.mode === "edit" && props.prepInStudyPlan === false) {
        nameColorClass = "redColor";
    }

    function renderTooltip(props) {
        let preparatoryCourse = null

        if (props.popper.state) {
            preparatoryCourse = props.popper.state.options.prep + "-" + props.popper.state.options.prepName;
        }

        return (

            <Tooltip className="mytooltip" {...props}>
                {"Preparatory course " + preparatoryCourse + " is not in study-plan"}
            </Tooltip>
        );
    }

    let classForExpandedTr = "collapse";
    if (expanded) {
        classForExpandedTr = "collapse show";
    }


    return <>
        <tr onClick={() => setExpanded((expanded) => (!expanded))} style={{ cursor: 'pointer' }} className={colorClass}>
            <td>
                {props.course.code}

                {props.mode && props.mode === "edit" && props.addedToStudyPlan === true &&
                    <i className="bi bi-check-circle" style={{ color: "green", marginLeft: 5 }}></i>
                }
            </td>
            <td className={nameColorClass}>

                {props.mode && props.mode === "edit" && props.prepInStudyPlan === false ?

                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                        popperConfig={{ prep: props.course.preparatory_course, prepName: props.course.preparatory_course_name }}
                    >
                        <span>{props.course.name}<i className="bi bi-exclamation-triangle-fill" style={{ color: "red", marginLeft: 5, fontSize: 20 }}></i></span>
                    </OverlayTrigger> :
                    props.course.name
                }

                {expanded === false ? <b><i className="bi bi-arrow-down-right"></i></b> : <b><i className="bi bi-arrow-up-left"></i></b>}

            </td>
            <td>
                {props.course.credits}
            </td>
            <td>
                {props.course.max_students}
            </td>
            <td>
                {props.course.enrolled_students}
            </td>
            {props.mode && props.mode === "edit" && props.loading === false &&
                <td>
                    {props.addedToStudyPlan === false && props.hasError === false && props.prepInStudyPlan === true && props.isFull === false && <Button id={props.course.code} variant="success" onClick={props.handleAddNewCourse}><i className="bi bi-plus"></i></Button>}
                    {props.addedToStudyPlan === true && props.hasError === false && <Button id={"delete-" + props.course.code} variant="danger" onClick={props.handleRemoveCourse}><i className="bi bi-trash"></i></Button>}
                </td>
            }
        </tr>
        <tr className={classForExpandedTr} style={{ cursor: "pointer" }} onClick={() => setExpanded((expanded) => (!expanded))}>
            <td colSpan={props.mode && props.mode === "edit" ? 6 : 5} style={{ backgroundColor: "#D3EAEC" }}>
                <Table className='table-bordered'>
                    <thead>
                        <tr>
                            <th width="50%">Preparatory course</th>
                            <th width="50%">Incompatible with</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{props.course.preparatory_course && props.course.preparatory_course + "-" + props.course.preparatory_course_name}</td>
                            <td>
                                {incompatible_courses.map((incompatible_course) => (
                                    <p key={incompatible_course.name}>{incompatible_course.name}</p>
                                ))}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </td>
        </tr>
    </>
}




export default CourseListRow;