import { Alert, Card, Col, Row } from "react-bootstrap";
import LoginForm from "./LoginForm";

function Login(props) {
    return (
        <>
            <Row style={{ height: '100vh' }} className="gradient-custom">
                <Col></Col>
                <Col className="col-centered">
                    <Card style={{ marginTop: 20 }}>
                        <Card.Header>
                            <Row>
                                <Col></Col>
                                <Col className="text-center"><span style={{fontSize: 22}}> <i id="logo" className="bi bi-book"></i> Study Plan </span></Col>
                                <Col></Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col></Col>
                                <Col className="text-center"><h3>Login</h3></Col>
                                <Col></Col>
                            </Row>
                            {props.message && <Row>
                                <Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.message}</Alert>
                            </Row>}
                            <LoginForm login={props.login} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col></Col>
            </Row>
        </>)
}

export default Login;