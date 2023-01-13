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
import { getDateOptions, getYearOptions, month } from "../helpers/utils";

const AddNewBirthday = () => {
  const {
    data,
    setBirthdayData,
    handleInput,
    handleSubmit,
    message,
    imagePreview,
  } = useHandleInput();

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
            <select
              className="input"
              onChange={handleInput}
              value={data.gender}
              name="Gender"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="input-section">
            <label>Month: </label>

            <select
              className="input"
              name="month"
              id="month"
              value={data.month}
              onChange={(e) =>
                setBirthdayData((prev) => ({
                  ...prev,
                  data: { ...prev.data, month: +e.target.value },
                }))
              }
            >
              {[...Array(12)].map((val, i) => (
                <option value={i}>{month[i]}</option>
              ))}
            </select>
          </div>

          <div className="input-section">
            <label>Date: </label>
            <select
              className="input"
              name="date"
              id="date"
              value={data.date}
              onChange={(e) =>
                setBirthdayData((prev) => ({
                  ...prev,
                  data: { ...prev.data, date: +e.target.value },
                }))
              }
            >
              {getDateOptions(data.month).map((val, i) => (
                <option value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          <div className="input-section">
            <label>
              Year : <span className="mute">(Optional)</span>{" "}
            </label>

            <select
              className="input"
              name="month"
              id="month"
              value={data.year}
              onChange={(e) =>
                setBirthdayData((prev) => ({
                  ...prev,
                  data: { ...prev.data, year: +e.target.value || null },
                }))
              }
            >
              {getYearOptions().map((val, i) => (
                <option value={val} key={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
          <ImageUpload handleChange={handleInput} imagePreview={imagePreview} />

          <span>
            Birthday Entered:{" "}
            {`${data.date} ${month[data?.month || 0]} ${
              +data?.year ? data?.year : ""
            }`}
          </span>

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

function useHandleInput() {
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [birthdayData, setBirthdayData] = useState({
    data: { gender: "Male", date: 1, month: 0, year: null },
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
    console.log(data);
    addNewBirthday(data, token)
      .then((res) => {
        setMessage(res ? res.error || res.message : "No response");
        setBirthdayData({
          data: {
            name: "",
            date: 1,
            month: 0,
            year: null,
            image: "",
            gender: "Male",
          },
        });
      })
      .catch((err) => setMessage(err));
  }

  return {
    data: birthdayData.data,
    setBirthdayData,
    handleInput,
    handleSubmit,
    message,
    imagePreview,
  };
}
