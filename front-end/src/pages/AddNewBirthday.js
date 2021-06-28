import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCookie } from "../actions/auth";
import {
  addNewBirthday,
  processDataForSubmission,
} from "../actions/birthdayList";
import InputSection from "../components/auth/InputSection";
import ToastMessage from "../components/ToastMessage/ToastMessage.component";
import { limit } from "../utils/functions_for_components";

function useHandleInput() {
  const [message, setMessage] = useState("");
  const [birthdayData, setBirthdayData] = useState({
    data: { gender: "Male" },
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
        setBirthdayData({ data: { name: "", date: "", image: "" } });
      })
      .catch((err) => console.log(err));
  }

  return { data: birthdayData.data, handleInput, handleSubmit, message };
}

const AddNewBirthday = () => {
  const { data, handleInput, handleSubmit, message } = useHandleInput();
  return (
    <div className="main-container">
      <ToastMessage message={message} />

      <div className="container">
        <h3>Enter Details</h3>
        <Link to={`/list/${localStorage.getItem("name")}`} id="backBtn">
          Back
        </Link>
        <form onSubmit={handleSubmit}>
          <InputSection
            label="Name"
            inputType="text"
            example="John"
            value={data.name}
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
              value={data.date}
              max={limit()}
              onChange={handleInput}
            />
          </div>

          <InputSection
            label="Image"
            inputType="file"
            isNotRequired
            value={data.image}
            handleChange={handleInput}
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
