import { Alert, Button, Card, Col, Modal, Nav, Row, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CourseListTable from "./CourseListTable";
import StudyPlanCreditHeader from "./StudyPlanCreditHeader";
import studyPlanAPI from '../API/studyPlanAPI';
import { useState } from "react";

function CourseList(props) {

    return <>
        <Tab.Container id="sidebar-tab" key={props.studyPlan ? props.studyPlan.id : 0} defaultActiveKey={props.studyPlan ? "study-plan" : "all"}>
            <Row>
                <Col sm={2}>
                    <Card>
                        <Card.Body>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item>
                                    <Nav.Link eventKey="all" style={{ cursor: "pointer" }}>All courses</Nav.Link>
                                </Nav.Item>
                                {
                                    props.studyPlan ?
                                        <Nav.Item>
                                            <Nav.Link eventKey="study-plan" style={{ cursor: "pointer" }}>My Study Plan</Nav.Link>
                                        </Nav.Item> : ""
                                }
                            </Nav>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={10}>
                    {props.message && <Row>
                        <Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.message}</Alert>
                    </Row>}
                    <Tab.Content>
                        <Tab.Pane eventKey="all">
                            <AllCoursesList courses={props.courses} currentPage={props.currentPage} studyPlan={props.studyPlan} />
                        </Tab.Pane>
                        {
                            props.studyPlan ?
                                <Tab.Pane eventKey="study-plan">
                                    <StudyPlanCoursesList loading={props.loading} setLoading={props.setLoading} sumCredits={props.sumCredits} studyPlan={props.studyPlan} courses={props.studyPlanCourses} getAllCourses={props.getAllCourses} getStudyPlan={props.getStudyPlan} />
                                </Tab.Pane> : ""
                        }

                    </Tab.Content>
                </Col>
            </Row>

        </Tab.Container>
    </>;
}

function AllCoursesList(props) {

    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return <>
        <Row>
            <Col>
                {props.studyPlan ? "" : <p><Button onClick={() => { handleNavigation('/add') }}><i className="bi bi-plus"></i>  Create your own study plan</Button></p>}
                <h2>All Courses</h2>
                <CourseListTable courses={props.courses} />
            </Col>
        </Row>
    </>;
}

function StudyPlanCoursesList(props) {

    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleRemoveStudyPlan = async (event) => {
        setShowModal(false);
        try {
            props.setLoading(true);
            await studyPlanAPI.removeStudyPlan(props.studyPlan.id);
        } catch (error) {
            console.log(error.code);
        }
        props.getAllCourses();
        props.getStudyPlan();
        props.setLoading(false);
    }

    return <>
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Removing Study-Plan</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure that you want to remove your Study-Plan ?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    No
                </Button>
                <Button variant="danger" onClick={handleRemoveStudyPlan}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
        <Row>
            <Col>
                <StudyPlanCreditHeader sumCredits={props.sumCredits} courses={props.courses} studyPlan={props.studyPlan} studyPlanType={props.studyPlanType} />
                <Button variant="success" style={{ marginBottom: 10, marginRight: 10 }} onClick={() => { handleNavigation('/add-course') }}>
                    <i className="bi bi-pen"></i> Edit
                </Button>
                <Button variant="danger" style={{ marginBottom: 10 }} onClick={handleShowModal}>
                    <i className="bi bi-trash"></i> Remove
                </Button>
                <CourseListTable courses={props.courses} studyPlanType={props.studyPlan.type} />
            </Col>
        </Row>
    </>;
}


export default CourseList;