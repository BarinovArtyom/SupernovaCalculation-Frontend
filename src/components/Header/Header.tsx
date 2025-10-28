import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { ROUTES } from "../../Routes";
import "./Header.css";
import image from '../../statics/home.png';

const Header: React.FC = () => {
  return (
    <div className='header'>
      <Navbar expand="lg" className="custom-navbar">
        <Container>
          <Navbar.Brand href={ROUTES.HOME}>
            <img 
              className="home-icon" 
              src={image}
              alt="Домой" 
            />
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href={ROUTES.SCOPES}>Телескопы</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;