import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getCookie } from "../actions/auth";
import {
  addNewBirthday,
  processDataForSubmission,
} from "../actions/birthdayList";
import ImageUpload from "../components/Inputs/ImageUpload/ImageUpload";
import InputSection from "../components/Inputs/InputSection";
import ToastMessage from "../components/ToastMessage/ToastMessage.component";
import { limit } from "../helpers/utils";

function useHandleInput() {
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [birthdayData, setBirthdayData] = useState({
    data: { gender: "Male" },
  });

  function handleInput(e) {
    const data = birthdayData.data;
    const name = e.target.name.toLowerCase();

    data[name] = name === "image" ? e.target.files[0] : e.target.value;

    if (name === "image" && e.target.files[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    } else {
      setImagePreview(null);
    }

    setBirthdayData({ data });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("Loading...");
    const token = getCookie("token");

    if (!token.trim()) return setMessage("Please Login to add Birthdays");

    const data = processDataForSubmission(birthdayData.data);
    addNewBirthday(data, token)
      .then((res) => {
        setMessage(res ? res.error || res.message : "No response");
        setBirthdayData({ data: { name: "", date: "", image: "" } });
      })
      .catch((err) => setMessage(err));
  }

  return {
    data: birthdayData.data,
    handleInput,
    handleSubmit,
    message,
    imagePreview,
  };
}

const AddNewBirthday = () => {
  const { data, handleInput, handleSubmit, message, imagePreview } =
    useHandleInput();
  return (
    <div className="main-container">
      <ToastMessage message={message} />

      <div className="container">
        <h3>Enter Details</h3>
        <Link to={`/list/${localStorage.getItem("name")}`} id="btn-danger">
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

          <ImageUpload handleChange={handleInput} imagePreview={imagePreview} />

          <div className="form-group">
            <input
              disabled={message === "Loading..."}
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
