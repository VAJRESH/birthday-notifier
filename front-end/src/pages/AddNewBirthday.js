import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  capitalize,
  DisplayMessage,
  limit,
} from "../utils/functions_for_components";
import {
  addNewBirthday,
  processDataForSubmission,
} from "../actions/birthdayList";
import InputSection from "../components/auth/InputSection";
import { getCookie } from "../actions/auth";

function useHandleInput() {
  const [message, setMessage] = useState("");
  const [birthdayData, setBirthdayData] = useState({
    data: { gender: "Male" },
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("");
    }, 2000);

    return () => clearTimeout(timer);
  });
  
  function handleInput(e) {
    console.log(e.target);
    const data = birthdayData.data;
    const name = e.target.name.toLowerCase();
    data[name] = name === "image" ? e.target.files[0] : e.target.value;

    setBirthdayData({ data });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(e.target);
    console.log(birthdayData);
    const data = processDataForSubmission(birthdayData.data);
    addNewBirthday(data, getCookie("token"))
      .then((res) => {
        console.log(res);
        setMessage(res ? res.error || res.message : "No response");
      })
      .catch((err) => console.log(err));
  }

  return { handleInput, handleSubmit, message };
}

const AddNewBirthday = () => {
  const { handleInput, handleSubmit, message } = useHandleInput();
  return (
    <div className="main-container">
      <div className="container">
        <h3>Enter Details</h3>
        <Link to={`/list/${localStorage.getItem("name")}`} id="backBtn">
          Back
        </Link>
        <div>{message}</div>
        <form onSubmit={handleSubmit}>
          <InputSection
            label="Name"
            inputType="text"
            example="John"
            handleChange={handleInput}
            errorMessage={message.name}
          />

          <div className="input-section">
            <label>Gender: </label>
            <select className="input" onChange={handleInput} name="Gender">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="input-section">
            <label>Date: </label>
            <input
              type="date"
              required
              name="Date"
              className="input"
              max={limit()}
              onChange={handleInput}
            />
          </div>

          <InputSection
            label="Image"
            inputType="file"
            isNotRequired
            //   example="John"
            handleChange={handleInput}
            //   errorMessage={message.name}
          />

          <div className="form-group">
            <input
              type="submit"
              value="Add Birthday"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewBirthday;
