import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import UserContext from "../context/UserContext";

export default function AppNavbar() {
  const { user, unsetUser } = useContext(UserContext) || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    unsetUser();
    navigate("/login");
  };

  const handleBrandClick = (e) => {
    e.preventDefault(); // prevent default reload
    if (user && user.id) {
      navigate("/workouts"); // logged in users go to dashboard
    } else {
      navigate("/register"); // not logged in users go to registration
    }
  };

  const activeStyle = {
    fontWeight: "bold",
    color: "#ffdd59", // highlight color
  };

  return (
    <Navbar expand="lg" className="custom-navbar shadow-sm">
      <Container>
        <Navbar.Brand href="/" onClick={handleBrandClick} className="fw-bold">
          Tracked
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            {user && user.id ? (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/workouts"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                >
                  Workouts
                </Nav.Link>
                <Button variant="light" onClick={handleLogout} className="ms-2">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/register"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                >
                  Register
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/login"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                >
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}