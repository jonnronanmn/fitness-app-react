import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Notyf } from "notyf";
import 'notyf/notyf.min.css';
import '../App.css';

const notyf = new Notyf();
const API_URL = process.env.REACT_APP_API_URL;

export default function Register() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      notyf.success(data.message || "Registered successfully!");
      navigate("/login");
    } catch (err) {
      notyf.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center">
        <Row className="w-100 justify-content-center align-items-center flex-nowrap">

          {/* Left: Text Panel */}
          <Col md={6} className="hero-left text-center text-md-start mb-4 mb-md-0">
            <div className="hero-bg-panel">
              <h1 className="hero-title">Welcome to <span className="highlight">Tracked</span></h1>
              <p className="hero-subtitle">
                Track your workouts, stay motivated, and achieve your fitness goals.  
                Join a community of fitness enthusiasts today!
              </p>
            </div>
          </Col>

          {/* Right: Registration Form */}
          <Col md={4}>
            <div className="hero-form shadow-lg rounded">
              <h2 className="text-center mb-4">Create Account</h2>
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
                    placeholder="Minimum 8 characters"
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                  {loading ? "Registering..." : "Sign Up"}
                </Button>
              </Form>
              <div className="text-center mt-3">
                Already have an account? <a href="/login" className="login-link">Login</a>
              </div>
            </div>
          </Col>

        </Row>
      </Container>
    </div>
  );
}