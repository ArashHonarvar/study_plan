import { Navbar, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './NavigationBar.css';

function NavigationBar(props) {

    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <Navbar>
            <Container>
                <Navbar.Brand style={{ color: "white", fontSize: 30 }}>
                    <i id="logo" className="bi bi-book" style={{ marginRight: 5 }}></i>
                    <span id='name'>Study Plan</span>
                </Navbar.Brand>
                <Navbar.Text className="justify-content-end">
                    {props.loggedIn && <span style={{ marginRight: 5, color: "white", fontSize: 20 }}><i className="bi bi-person-circle"></i> {props.user.name}</span>}
                    {props.loggedIn ? <Button variant="light" onClick={props.logout}>Logout</Button> : <Button variant="light" onClick={() => { handleNavigation('/login') }}>Login</Button>}
                </Navbar.Text>
            </Container>
        </Navbar>
    );
}
export default NavigationBar;