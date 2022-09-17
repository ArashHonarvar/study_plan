import Form from 'react-bootstrap/Form'
import { Button, Col, Row, Alert, Card } from 'react-bootstrap'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddStudyPlanForm(props) {

    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };
    const [type, setType] = useState('full-time');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        let userStudyPlan = { id: null, type: type };
        props.setStudyPlan(userStudyPlan);
        props.setStudyPlanType(type);
        setType('full-time');
        handleNavigation('/add-course');
    }


    return <>
        <Row style={{ display: 'flex', justifyContent: 'center' }}>
            <Col xs={8} md={5} >
                <Card>
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="title">
                                        <Form.Label>Select the type of your Study-Plan</Form.Label>
                                        <Form.Select aria-label="Default select" required={true} onChange={(event) => { setType(event.target.value) }}>
                                            <option value="full-time">Full-Time</option>
                                            <option value="part-time">Part-Time</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <br />
                                    <Button variant="primary" type="submit" >
                                        Add
                                    </Button>
                                    <Button onClick={() => handleNavigation('/')} variant="secondary" type="button" style={{ marginLeft: 5 }}>
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>
}

export default AddStudyPlanForm;