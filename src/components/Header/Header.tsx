import React from 'react';
import { Nav, Navbar, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROUTES } from "../../Routes";
import "./Header.css";
import image from '../../statics/home.png';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from '../../store/store';
import { logoutUserAsync } from '../../store/slices/userSlice'; 
import { setSearchValue, getScopesList } from '../../store/slices/scopesSlice'; 

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const username = useSelector((state: RootState) => state.user.username);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  const handleExit = async ()  => {
    await dispatch(logoutUserAsync());
    dispatch(setSearchValue(''));
    navigate('/scopes');
    await dispatch(getScopesList());
  }

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

              {isAuthenticated && (
                <>
                <Nav.Link 
                    as={Link} 
                    to={ROUTES.PROFILE}
                    className="nav-link-custom username-link"
                    eventKey="3"
                  >
                    {username}
                  </Nav.Link>
                  <Nav.Link 
                    as={Link} 
                    to={ROUTES.STARS}
                    className="nav-link-custom"
                    eventKey="2"
                  >
                    Мои заявки
                  </Nav.Link>
                </>
              )}

              <Nav.Link 
                as={Link} 
                to={ROUTES.SCOPES}
                className="nav-link-custom"
                eventKey="1"
              >
                Телескопы
              </Nav.Link>

              {!isAuthenticated && (
                <Nav.Link 
                  as={Link} 
                  to={ROUTES.REGISTER}
                  className="nav-link-custom"
                  eventKey="4"
                >
                  Регистрация
                </Nav.Link>
              )}
            </Nav>

            <Nav>
              {!isAuthenticated ? (
                <>
                  <Link to={ROUTES.LOGIN}>
                    <Button className="login-btn">Войти</Button>
                  </Link>
                </>
              ) : (
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="login-btn" 
                  onClick={handleExit}
                >
                  Выйти
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;