import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = { username, password };

        props.login(credentials);
    }

    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <>
            <Row>
                <Col lg="2"></Col>
                <Col>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={password} onChange={ev => setPassword(ev.target.value)} required={true} />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="text-center"> Submit </Button>
                        <Button variant="secondary" className="text-center" onClick={() => handleNavigation("/")} style={{marginLeft: 5}}> Cancel </Button>
                    </Form>
                </Col>
                <Col lg="2"></Col>
            </Row>
        </>
    );
}

export default LoginForm;