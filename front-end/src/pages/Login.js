import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import {
  isLoggedIn,
  isPasswordStrong,
  isValidEmail,
  login,
  setCookies,
} from "../actions/auth";
import InputSection from "../components/Inputs/InputSection";

// validates all the input and generate appropriate messages
function useHandleInputs(history) {
  const [message, setMessage] = useState({
    email: "",
    password: "",
    success: "",
  });
  const [data, setData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (isLoggedIn()) return history.push("/user/logout");
    // eslint-disable-next-line
  }, []);

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

    login(data).then((response) => {
      setMessage({
        ...message,
        success: response ? response.error || "Login Success" : "No response",
      });
      if (response.error) return;

      if (response) {
        setCookies("token", response.token);
        localStorage.setItem("userId", response.user._id);
        localStorage.setItem("name", response.user.name);
        localStorage.setItem("email", response.user.email);
        // redirect user to home page after successful login
        setTimeout(() => {
          history.push("/");
        }, 2000);
      }
    });
  }

  return { handleEmail, handlePassword, handleSubmit, message };
}

const Login = ({ history }) => {
  const { handleEmail, handlePassword, handleSubmit, message } =
    useHandleInputs(history);

  return (
    <div className="main-container">
      <form className="container" onSubmit={handleSubmit}>
        <h1 className="heading">Login</h1>
        <div className="redirect-link">
          <Link to="/user/register">
            Please Register if you don't have an account here
          </Link>
        </div>

        <div id={message.success && "true"}>{message.success}</div>

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

        <div className="form-group">
          <input type="submit" value="Login" />
        </div>
      </form>
    </div>
  );
};

export default withRouter(Login);
