import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  capitalize,
  DisplayMessage,
  limit,
} from "../utils/functions_for_components";
import InputSection from "../components/auth/InputSection";

const AddNewBirthday = () => {
  const [message, setMessage] = useState({});
  function handleInput(e) {}
  return (
    <div className="main-container">
      <div className="container">
        <h3>Enter Details</h3>
        <Link to={`/list/${localStorage.getItem("name")}`} id="backBtn">
          Back
        </Link>
        <form>
          <InputSection
            label="Name"
            inputType="text"
            example="John"
            handleChange={handleInput}
            errorMessage={message.name}
          />

          <div className="input-section">
            <label>Gender: </label>
            <select className="input" onChange={handleInput}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="input-section">
            <label>Date: </label>
            <input
              type="date"
              required
              className="input"
              max={limit()}
              onChange={handleInput}
            />
          </div>

          <InputSection
            label="Image"
            inputType="file"
            //   example="John"
            handleChange={handleInput}
            //   errorMessage={message.name}
          />

          {/* <div className="form-group">
                        <label>Image:</label>
                        <input type="file"
                        className="input"
                        onChange={this.onChangeImage}
                        />
                    </div> */}

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
