import React from "react";
import "./InputSection.css";

const InputSection = ({
  label,
  inputType,
  example,
  handleChange,
  errorMessage,
}) => {
  return (
    <div className="input-section">
      <label htmlFor={label}>{label}</label>
      <input
        type={inputType}
        required
        placeholder={example}
        className="input"
        name={label}
        onChange={handleChange}
      />
      <small>{errorMessage}</small>
    </div>
  );
};

export default InputSection;
