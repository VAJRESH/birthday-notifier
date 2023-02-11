import React, { useState } from "react";
import { getCookie } from "../../../actions/auth";
import {
  editBirthday,
  processDataForSubmission,
} from "../../../actions/birthdayList";
import { getDateOptions, getYearOptions, month } from "../../../helpers/utils";
import InputSection from "../../Inputs/InputSection";
import "../EditModal.css";

const EditBirthday = ({ birthdayData, reloadList, closeModal }) => {
  const { handleInput, handleSubmit, message, data, setBirthdayData } =
    useHandleInput(birthdayData, reloadList, closeModal);

  return (
    <div className="modal-container">
      <section className="close-modal" onClick={closeModal}>
        <button className="close-btn">X</button>
      </section>

      <div className="modal-content">
        <h3>Edit Details</h3>

        <div>{message}</div>
        <form onSubmit={handleSubmit}>
          <InputSection
            label="Name"
            inputType="text"
            example="John"
            value={data.name}
            handleChange={handleInput}
            errorMessage={message?.name}
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
              {getDateOptions(data?.month).map((val, i) => (
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

          <span>
            Birthday Entered:{" "}
            {`${data.date} ${month[data?.month || 0]} ${
              +data?.year ? data?.year : ""
            }`}
          </span>

          <div className="form-group">
            <input
              type="submit"
              value="Edit Birthday"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBirthday;

function useHandleInput(originalData, reloadList, closeModal) {
  const { name, gender, date, month, year, ...remainingData } = originalData;

  const [message, setMessage] = useState("");
  const [birthdayData, setBirthdayData] = useState({
    data: { name, gender, date, month, year },
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
        setMessage(res ? res.error || res.message : "No response");

        setTimeout(() => {
          console.log(message?.includes("updated"));
          if (res && res.message?.includes("updated")) {
            closeModal();
            reloadList();
          }
          setMessage("");
        }, 1000);
      })
      .catch((err) => console.log(err));
  }

  return {
    handleInput,
    handleSubmit,
    message,
    data: birthdayData.data,
    setBirthdayData,
  };
}
