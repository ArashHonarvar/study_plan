
import React from 'react';
import { Badge, Card, Col, Row } from 'react-bootstrap';

function StudyPlanCreditHeader(props) {

    let studyPlanType = null;
    if (props.studyPlan) {
        studyPlanType = props.studyPlan.type;
    } else {
        studyPlanType = props.studyPlanType;
    }
    const maxCredits = studyPlanType === 'full-time' ? 80 : 40;
    const minCredits = studyPlanType === 'full-time' ? 60 : 20;
    const remainingCredits = maxCredits - props.sumCredits;

    //upercasing each word of a string
    function titleCase(str) {
        if (str) {
            str = str.replace("-", " ");
            var splitStr = str.toLowerCase().split(' ');
            for (var i = 0; i < splitStr.length; i++) {
                splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
            }
            return splitStr.join(' ');
        }
        return "";
    }


    return <>
        <Row style={{ marginBottom: 10 }}>
            <Col></Col>
            <Col className="text-center">
                <Badge pill bg="info" style={{ fontSize: 15 }}>
                    {studyPlanType ? titleCase(studyPlanType) : ""}
                </Badge>
            </Col>
            <Col></Col>
        </Row>
        <Row>
            <Col>
                <Row>
                    <Col></Col>
                    <Col>
                        <Card
                            bg="light"
                            key="credits"
                            text="Credits Info"
                            style={{ width: '18rem' }}
                            className="mb-2 text-center"
                        >
                            <Card.Header>Credits Added</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {props.sumCredits}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col></Col>
                </Row>
            </Col>
            <Col>
                <Row>
                    <Col></Col>
                    <Col>
                        <Card
                            bg="light"
                            key="credits"
                            text="Credits Info"
                            style={{ width: '18rem' }}
                            className="mb-2 text-center"
                        >
                            <Card.Header>Remaining Credits</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {remainingCredits >= 0 ? remainingCredits : `Remove ${Math.abs(remainingCredits)} credits`}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col></Col>
                </Row>
            </Col>
            <Col>
                <Row>
                    <Col></Col>
                    <Col>
                        <Card
                            bg="light"
                            key="credits"
                            text="Credits Info"
                            style={{ width: '18rem' }}
                            className="mb-2 text-center"
                        >
                            <Card.Header>Minimum - Maximum Credits</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {minCredits + "-" + maxCredits}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col></Col>
                </Row>
            </Col>
        </Row>
    </>;
}

export default StudyPlanCreditHeader;