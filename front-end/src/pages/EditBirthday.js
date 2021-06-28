import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { getCookie } from "../actions/auth";
import {
    editBirthday,
    processDataForSubmission
} from "../actions/birthdayList";
import InputSection from "../components/auth/InputSection";
import {
    limit
} from "../utils/functions_for_components";

function getFormattedDate(date, month, year) {
  if (date.toString().length === 1) date = "0" + date;
  if (month.toString().length === 1) month = "0" + (month + 1);
  return `${year}-${month}-${date}`;
}

function useHandleInput(origianlData) {
  const { name, gender, date, month, year, ...remainingData } = origianlData;

  const [message, setMessage] = useState("");
  const [birthdayData, setBirthdayData] = useState({
    data: { name, gender, date: getFormattedDate(date, month, year) },
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
    editBirthday(data, remainingData._id, getCookie("token"))
      .then((res) => {
        console.log(res);
        setMessage(res ? res.error || res.message : "No response");
      })
      .catch((err) => console.log(err));
  }

  return { handleInput, handleSubmit, message, data: birthdayData.data };
}

const EditBirthday = (router) => {
  const { handleInput, handleSubmit, message, data } = useHandleInput(
    router.location.state
  );
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
            value={data.name}
            handleChange={handleInput}
            errorMessage={message.name}
          />

          <div className="input-section">
            <label>Gender: </label>
            <select
              className="input"
              onChange={handleInput}
              name="Gender"
              value={data.gender}
            >
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

export default withRouter(EditBirthday);
