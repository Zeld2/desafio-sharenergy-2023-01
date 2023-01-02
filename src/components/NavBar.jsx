import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';

function Tabs() {
    const navigate = useNavigate()
  return (
    <Nav variant="tabs" defaultActiveKey="/" onSelect={(selectedKey) => navigate(`${selectedKey}`)}>
      <Nav.Item>
        <Nav.Link href="/">Users</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="/cats">HTTP Cats</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="/dogs">
          Random Dogs
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default Tabs;