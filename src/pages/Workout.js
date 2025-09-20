import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button, Modal, Nav, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import WorkoutCard from "../components/WorkoutCards";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf();
const API_URL = process.env.REACT_APP_API_URL;

export default function Workouts() {
  const { user, unsetUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [formData, setFormData] = useState({ name: "", duration: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editData, setEditData] = useState({ id: null, name: "", duration: "" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const token = localStorage.getItem("token");

  // Fetch workouts
  const fetchWorkouts = async () => {
    if (!token) {
      unsetUser();
      navigate("/login");
      return;
    }
    setFetching(true);
    try {
      const res = await fetch(`${API_URL}/workouts/getMyWorkouts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { // Token expired or invalid
          unsetUser();
          navigate("/login");
        }
        throw new Error(data.message || "Failed to fetch workouts");
      }
      setWorkouts(data.workouts);
    } catch (err) {
      notyf.error(err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter and search
  useEffect(() => {
    let filtered = workouts;
    if (filterStatus !== "all") filtered = filtered.filter(w => w.status === filterStatus);
    if (search) filtered = filtered.filter(w => w.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredWorkouts(filtered);
    setCurrentPage(1);
  }, [workouts, search, filterStatus]);

  // Add workout
  const handleAddWorkout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/workouts/addWorkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, status: "pending" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add workout");
      notyf.success("Workout added!");
      setFormData({ name: "", duration: "" });
      fetchWorkouts();
    } catch (err) {
      notyf.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete workout
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/workouts/deleteWorkout/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete workout");
      notyf.success("Workout deleted!");
      fetchWorkouts();
    } catch (err) {
      notyf.error(err.message);
    }
  };

  // Complete workout
  const handleComplete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/workouts/completeWorkoutStatus/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to complete workout");
      notyf.success("Workout marked as completed!");
      fetchWorkouts();
    } catch (err) {
      notyf.error(err.message);
    }
  };

  // Edit workout
  const handleEdit = (workout) => {
    setEditData(workout);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API_URL}/workouts/updateWorkout/${editData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editData.name, duration: editData.duration }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update workout");
      notyf.success("Workout updated!");
      setShowEditModal(false);
      fetchWorkouts();
    } catch (err) {
      notyf.error(err.message);
    }
  };

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentWorkouts = filteredWorkouts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredWorkouts.length / itemsPerPage);

  if (fetching) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
      <Spinner animation="border" variant="primary" />
    </div>
  );

  return (
    <Container style={{ marginTop: "50px" }}>
      <h2 className="mb-4">Workout Dashboard</h2>
      <Row>
        {/* Add Workout Form */}
        <Col md={4}>
          <h5>Add New Workout</h5>
          <Form onSubmit={handleAddWorkout}>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Workout Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Duration (minutes)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
            </Form.Group>
            <Button type="submit" disabled={loading} className="w-100">
              {loading ? "Adding..." : "Add Workout"}
            </Button>
          </Form>
        </Col>

        {/* Workout List */}
        <Col md={8}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Control
                placeholder="Search workouts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <Nav variant="pills" defaultActiveKey="all" onSelect={(k) => setFilterStatus(k)}>
                <Nav.Item><Nav.Link eventKey="all">All</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="pending">Pending</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="completed">Completed</Nav.Link></Nav.Item>
              </Nav>
            </Col>
          </Row>

          <Row>
            {currentWorkouts.length === 0 && <p>No workouts found.</p>}
            {currentWorkouts.map((workout) => (
              <Col md={6} key={workout._id}>
                <WorkoutCard
                  workout={workout}
                  onComplete={handleComplete}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  className="mx-1"
                  variant={currentPage === i + 1 ? "primary" : "outline-primary"}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Duration</Form.Label>
            <Form.Control
              type="number"
              value={editData.duration}
              onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdate}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}