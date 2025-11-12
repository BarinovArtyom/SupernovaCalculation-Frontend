import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROUTES } from "../../Routes";
import "./Header.css";
import image from '../../statics/home.png';

const Header: React.FC = () => {
  return (
    <div className='header'>
      <Navbar expand="lg" className="custom-navbar" collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to={ROUTES.HOME} className="brand-link">
            <img 
              className="home-icon" 
              src={image}
              alt="Домой" 
            />
          </Navbar.Brand>
          
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav" 
            className="custom-toggler"
          />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                as={Link} 
                to={ROUTES.SCOPES}
                className="nav-link-custom"
                eventKey="1"
              >
                Телескопы
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;