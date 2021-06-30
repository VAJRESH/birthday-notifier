import React, { useState } from "react";
import { getCookie } from "../../../actions/auth";
import {
  editBirthday,
  processDataForSubmission
} from "../../../actions/birthdayList";
import { getFormattedDate, limit } from "../../../helpers/utils";
import InputSection from "../../Inputs/InputSection";
import "../EditModal.css";

function useHandleInput(originalData, reloadList, closeModal) {
  const { name, gender, date, month, year, ...remainingData } = originalData;

  const [message, setMessage] = useState("");
  const [birthdayData, setBirthdayData] = useState({
    data: { name, gender, date: getFormattedDate(date, month, year) },
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
          console.log(message.includes("updated"));
          if (res && res.message.includes("updated")) {
            closeModal();
            reloadList();
          }
          setMessage("");
        }, 1000);
      })
      .catch((err) => console.log(err));
  }

  return { handleInput, handleSubmit, message, data: birthdayData.data };
}

const EditBirthday = ({ birthdayData, reloadList, closeModal }) => {
  const { handleInput, handleSubmit, message, data } = useHandleInput(
    birthdayData,
    reloadList,
    closeModal
  );

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
