import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { deleteUser, getCookie, isLoggedIn, logout } from "../actions/auth";

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
          history.push("/user/login");
        }, 1000);
      }
    });
  }

  function handleDelete() {
    let confirm = window.confirm('Please confirm that you want to delete your account and its associated data which cannot be recovered ?');
    if (confirm) {
      deleteUser(getCookie('token')).then(res => {
        
      setMessage(res || "No response");
      if (res) {
        // redirect user login page
        setTimeout(() => {
          history.push("/");
        }, 1000);
      }
      })
    }
  }

  return { handleLogout, handleDelete, message };
}

const Logout = ({ history }) => {
  const { handleLogout, handleDelete, message } = useLogout(history);

  return (
    <div className="main-container">
      <section className="container">
        <h1 className="heading">Logout</h1>
        <div className="message-info">
          Logout and clear all your data from this device. You can login and
          retrieve your data with same email and password
        </div>

        <div id={message && "true"}>{message}</div>

        <div className="form-group">
          <input type="submit" value="Logout" onClick={handleLogout} />
        </div>

        <div className="form-group">
          <button id="btn-danger" className='btn-danger' onClick={handleDelete}>
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
};

export default withRouter(Logout);
