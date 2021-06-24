import React, { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../actions/auth";
import InputSection from "../components/auth/InputSection";

function useHandleInputs() {
  const [message, setMessage] = useState({
    name: "",
    email: "",
    password: "",
    success: "",
  });
  const [data, setData] = useState({ name: "", email: "", password: "" });

  function handleName(e) {
    setMessage({
      ...message,
      name:
        e.target.value.length < 3
          ? "Name should be of at least 3 characters."
          : null,
    });
    setData({ ...data, name: e.target.value });
  }
  function handleEmail(e) {
    // https://stackoverflow.com/questions/46841752/javascript-regular-expressions-email-address
    const regex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
    setMessage({
      ...message,
      email: !regex.test(e.target.value)
        ? "Enter a valid email address."
        : null,
    });
    setData({ ...data, email: e.target.value });
  }
  function handlePassword(e) {
    setMessage({
      ...message,
      password:
        e.target.value.length < 6
          ? "Password should be at least 6 characters."
          : null,
    });
    setData({ ...data, password: e.target.value });
  }
  function handleSubmit(e) {
    e.preventDefault();
    console.log(data);
    register(data).then((response) => {
      setMessage({
        ...message,
        success: response ? response.error || response.message : "No response",
      });
    });
  }
  return { handleName, handleEmail, handlePassword, handleSubmit, message };
}

export default function Register() {
  const { handleName, handleEmail, handlePassword, handleSubmit, message } =
    useHandleInputs();

  return (
    <div className="main-container">
      <form className="container" onSubmit={handleSubmit}>
        <div id="true">{message.success}</div>

        <InputSection
          label="Name"
          type="text"
          example="John"
          handleChange={handleName}
          errorMessage={message.name}
        />
        <InputSection
          label="Email"
          type="email"
          example="johndoe@gmail.com"
          handleChange={handleEmail}
          errorMessage={message.email}
        />
        <InputSection
          label="Password"
          type="password"
          example="John@!0Pass11"
          handleChange={handlePassword}
          errorMessage={message.password}
        />

        <div className="form-group">
          <input type="submit" value="Register" />
        </div>
      </form>
    </div>
  );
}
