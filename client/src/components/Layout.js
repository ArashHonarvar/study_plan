import { Container, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import NavigationBar from './NavigationBar';

function Layout(props) {

    return (
        <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
            <NavigationBar logout={props.logout} loggedIn={props.loggedIn} user={props.user} />
            <Row className="mainContent" style={{ padding: 30 }}>
                <Outlet />
            </Row>
        </Container>
    );
}

export default Layout;