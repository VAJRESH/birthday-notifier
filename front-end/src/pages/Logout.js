import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { isLoggedIn, logout } from "../actions/auth";

// validates all the input and generate appropriate messages
function useLogout(history) {
  const [message, setMessage] = useState();

  useEffect(() => {
    if (!isLoggedIn()) return history.push("/user/login");
  }, [history]);

  function handleLogout(e) {
    e.preventDefault();

    logout().then((response) => {
      setMessage(response || "No response");
      if (response) {
        // redirect user login page
        setTimeout(() => {
          console.log("login");
          history.push("/user/login");
        }, 1000);
      }
    });
  }

  return { handleLogout, message };
}

const Logout = ({ history }) => {
  const { handleLogout, message } = useLogout(history);

  return (
    <div className="main-container">
      <section className="container">
        <h1 className="heading">Logout</h1>
        <div className="redirect-link">
          Logout and clear all your data from this device. You can login and
          retrieve your data with same email and password
        </div>

        <div id={message && "true"}>{message}</div>

        <div className="form-group">
          <input type="submit" value="Logout" onClick={handleLogout} />
        </div>
      </section>
    </div>
  );
};

export default withRouter(Logout);
