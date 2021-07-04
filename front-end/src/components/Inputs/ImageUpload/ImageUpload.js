import React from "react";
import "./ImageUpload.css";

const ImageUpload = ({ isRequired, handleChange, imagePreview }) => {
  return (
    <div className="input-section">
      <label htmlFor="image">Image</label>
      <input
        type="file"
        required={isRequired}
        className="input"
        name="image"
        onChange={handleChange}
      />

      {imagePreview && <small>To remove image Choose File and cancel</small>}
      {imagePreview && <img id="preview-img" src={imagePreview} alt="" />}
    </div>
  );
};

export default ImageUpload;
