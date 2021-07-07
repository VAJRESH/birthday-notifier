import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  isLoggedIn,
  isNameAvailable,
  isPasswordStrong,
  isValidEmail,
  isValidName,
  register,
} from "../actions/auth";
import InputSection from "../components/Inputs/InputSection";

// validates all the input and generate appropriate messages
function useHandleInputs(history) {
  const [message, setMessage] = useState({
    name: "",
    email: "",
    password: "",
    success: "",
  });
  const [data, setData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (isLoggedIn()) return history.push("/user/logout");
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!data.name) return;
    
    const reqApi = setTimeout(() => {
      isNameAvailable(data.name).then((res) => {
        if (res) {
          setMessage({ ...message, name: "Name is taken" });
        } else {
          setMessage({ ...message, name: "Name is available" });
        }
      });
    }, 1000);
    
    return () => clearTimeout(reqApi);
    // eslint-disable-next-line
  }, [data.name]);

  function handleName(e) {
    setMessage({
      ...message,
      name: isValidName(e.target.value),
    });
    setData({ ...data, name: e.target.value });
  }

  function handleEmail(e) {
    setMessage({
      ...message,
      email: isValidEmail(e.target.value),
    });
    setData({ ...data, email: e.target.value });
  }

  function handlePassword(e) {
    setMessage({
      ...message,
      password: isPasswordStrong(e.target.value),
    });
    setData({ ...data, password: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    register(data).then((response) => {
      setMessage({
        ...message,
        success: response ? response.error || response.message : "No response",
      });

      if (!response) return;
      if (response.error === "Email is taken" || response.message) {
        setTimeout(() => {
          history.push("/user/login");
        }, 1000);
      }
    });
  }

  return { handleName, handleEmail, handlePassword, handleSubmit, message };
}

const Register = ({ history }) => {
  const { handleName, handleEmail, handlePassword, handleSubmit, message } =
    useHandleInputs(history);

  return (
    <div className="main-container">
      <form className="container" onSubmit={handleSubmit}>
        <h1 className="heading">Register</h1>
        <div className="redirect-link">
          <Link to="/user/login">
            Please Login if you have already registered here
          </Link>
        </div>

        <div id={message.success && "true"}>{message.success}</div>

        <InputSection
          label="Name"
          inputType="text"
          example="John"
          handleChange={handleName}
          errorMessage={message.name}
        />
        <InputSection
          label="Email"
          inputType="email"
          example="johndoe@gmail.com"
          handleChange={handleEmail}
          errorMessage={message.email}
        />
        <InputSection
          label="Password"
          inputType="password"
          example="John@!0Pass11"
          handleChange={handlePassword}
          errorMessage={message.password}
        />
        <div className="message-danger">
          You can delete your account after registration if you want
        </div>
        <div className="form-group">
          <input type="submit" value="Register" />
        </div>
        <div className="message-info">
          If you want the experience without registering, go to login page and
          login with demo account.
        </div>
      </form>
    </div>
  );
};
export default withRouter(Register);
