import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Notyf } from "notyf";
import UserContext from "../context/UserContext";
import '../App.css';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

// Use the environment variable
const API_URL = process.env.REACT_APP_API_URL;

export default function Login() {
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // On component mount, check if token exists and fetch profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_URL}/users/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser({ id: data.user._id, isAdmin: data.user.isAdmin });
            navigate("/workouts");
          } else {
            localStorage.removeItem("token");
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, [navigate, setUser]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Login request
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { throw new Error("Invalid server response"); }

      if (!res.ok) throw new Error(data.message || "Login failed");

      // Store token
      localStorage.setItem("token", data.access);

      // Fetch user profile
      const userRes = await fetch(`${API_URL}/users/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.access}`,
        },
      });

      const userText = await userRes.text();
      let userData;
      try { userData = JSON.parse(userText); } catch { throw new Error("Invalid server response"); }

      if (!userRes.ok || !userData.user) throw new Error("Failed to fetch user");

      setUser({ id: userData.user._id, isAdmin: userData.user.isAdmin });

      notyf.success("Logged in successfully!");
      navigate("/workouts");
    } catch (err) {
      notyf.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center">
        <Row className="w-100 justify-content-center">
          <Col md={4} className="d-flex justify-content-center">
            <div className="hero-form shadow-lg rounded p-5">
              <h2 className="text-center mb-4">Login</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Form>
              <div className="text-center mt-3">
                Don't have an account? <a href="/register" className="login-link">Register</a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}