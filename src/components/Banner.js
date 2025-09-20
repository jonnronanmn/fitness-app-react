import React from "react";

export default function Banner() {
  return (
    <section className="banner">
      <div className="banner-content">
        <h1>Welcome to Fitness App 🏋️</h1>
        <p>Track your workouts, stay consistent, and reach your goals.</p>
        <a href="/register" className="btn btn-light btn-lg mt-3">
          Get Started
        </a>
      </div>
    </section>
  );
}