import React from "react";
import "./InputSection.css";

const InputSection = ({
  label,
  inputType,
  example,
  isNotRequired,
  handleChange,
  errorMessage,
}) => {
  return (
    <div className="input-section">
      <label htmlFor={label}>{label}</label>
      <input
        type={inputType}
        required={isNotRequired? false: true}
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
