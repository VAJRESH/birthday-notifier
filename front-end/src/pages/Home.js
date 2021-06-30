import React from "react";
import { Link } from "react-router-dom";
import ServiceCard from "../components/Card/ServiceCard/ServiceCard";

const Home = () => {
  const services = [
    {
      id: 1,
      icon: "ICON",
      service: "Register yourself for free",
    },
    {
      id: 2,
      icon: "ICON",
      service: "Add birthdays of people you want",
    },
    {
      id: 3,
      icon: "ICON",
      service: "Get reminder on your registered email",
    },
  ];

  return (
    <div className="main-container">
      <section className="container">
        <h1 className="app-name">Birthday Notifier</h1>
        <article className="tagline">
          <p>Get reminded about birthdays of peoples you care.</p>
        </article>
        <div className="service-container">
          {services.map((item) => (
            <ServiceCard
              icon={item.icon}
              service={item.service}
              key={item.id}
            />
          ))}
        </div>

        <Link to="/user/register">
          <div className="cta">Get Started</div>
        </Link>

        <section>
          <h3>
            Have some feedback or suggestion that you would like to share!!
          </h3>
          <form className="feedback-form">
            <section className="form-section">
              <input
                type="email"
                id="email"
                className="feedback-input"
                placeholder="Email Address"
                required
              />
              <label className="feedback-label" htmlFor="email">
                Email Address
              </label>
            </section>
            <section className="form-section">
              <input
                type="text"
                id="subject"
                className="feedback-input"
                placeholder="Subject"
                required
              />
              <label className="feedback-label" htmlFor="subject">
                Subject
              </label>
            </section>
            <section className="form-section">
              <textarea
                cols="30"
                id="message"
                className="feedback-input"
                placeholder="Message"
                required
              />
              <label className="feedback-label" htmlFor="message">
                Message
              </label>
            </section>
          </form>
        </section>
      </section>

      <section className="portfolio-link">
        <a
          href="https://vajresh.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>Visit my portfolio.</h2>
        </a>
      </section>
    </div>
  );
};

export default Home;
