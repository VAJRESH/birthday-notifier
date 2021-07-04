import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendEmail } from "../actions/user";
import ServiceCard from "../components/Card/ServiceCard/ServiceCard";

function useHandleFeedback() {
  const [message, setMessage] = useState("");

  function submitForm(e) {
    e.preventDefault();
    setMessage("Loading...");

    const emailData = {
      recipient: "vajresh005@gmail.com",
      subject: e.target[1].value,
      message: `Email: ${e.target[0].value}\nFeedback: ${e.target[2].value}`,
    };
    sendEmail(emailData)
      .then((res) => {
        console.log(res);
        setMessage("Email send successfully");

        setTimeout(() => {
          setMessage("");
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        setMessage("Something went wrong");
      });
  }
  return { message, submitForm };
}

const Home = () => {
  const { message, submitForm } = useHandleFeedback();
  const services = [
    {
      id: 1,
      icon: <i className="fas fa-registered" />,
      service: "Register yourself for free",
    },
    {
      id: 2,
      icon: <i className="fas fa-user-plus" />,
      service: "Add birthdays of people you want",
    },
    {
      id: 3,
      icon: <i className="fas fa-bell" />,
      service: "Get reminder on your registered email",
    },
  ];

  return (
    <div className="main-container">
      <section className="container home">
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
          <form className="feedback-form" onSubmit={submitForm}>
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
                rows='5'
                id="message"
                className="feedback-input"
                placeholder="Message"
                required
              />
              <label className="feedback-label" htmlFor="message">
                Message
              </label>
            </section>
            <small className="form-section">{message}</small>
            <section className="form-section">
              <input type="submit" className="submit-button" value="Submit" />
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
