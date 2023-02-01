import React from "react";
import "./InputSection.css";

const InputSection = ({
  label,
  inputType,
  example,
  value,
  isNotRequired,
  handleChange,
  errorMessage,
  inputProps = {},
}) => {
  return (
    <div className="input-section">
      <label htmlFor={label}>{label}</label>
      <input
        {...inputProps}
        type={inputType}
        placeholder={example}
        className="input"
        name={label}
        value={value}
        onChange={handleChange}
        required={!isNotRequired}
      />
      <small>{errorMessage}</small>
    </div>
  );
};

export default InputSection;
