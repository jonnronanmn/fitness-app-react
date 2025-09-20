import React from "react";
import { Card, Button, Badge, ProgressBar, Stack } from "react-bootstrap";

export default function WorkoutCard({ workout, onComplete, onEdit, onDelete }) {
  const isCompleted = workout.status.toLowerCase() === "completed";

  return (
    <Card
      className="mb-4 shadow-lg"
      style={{
        borderRadius: "15px",
        overflow: "hidden",
        transition: "0.3s",
      }}
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title className="mb-0">{workout.name}</Card.Title>
          <Badge
            pill
            bg={isCompleted ? "success" : "warning"}
            text={isCompleted ? "light" : "dark"}
          >
            {workout.status}
          </Badge>
        </div>

        <Card.Text
          className="mb-3"
          style={{ fontSize: "0.9rem", color: "#555" }}
        >
          <strong>Duration:</strong> {workout.duration} mins
          <br />
          <strong>Date Added:</strong>{" "}
          {workout.dateAdded
            ? new Date(workout.dateAdded).toLocaleString(undefined, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-"}
        </Card.Text>

        <ProgressBar
          now={isCompleted ? 100 : 0}
          variant={isCompleted ? "success" : "warning"}
          className="mb-3"
          style={{ height: "6px", borderRadius: "3px" }}
        />

        <Stack direction="horizontal" gap={2}>
          <Button
            size="sm"
            variant="success"
            onClick={() => onComplete(workout._id)}
            disabled={isCompleted}
          >
            {isCompleted ? "Done" : "Complete"}
          </Button>
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => onEdit(workout)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline-danger"
            onClick={() => onDelete(workout._id)}
          >
            Delete
          </Button>
        </Stack>
      </Card.Body>
    </Card>
  );
}