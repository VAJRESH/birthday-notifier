import React, { useState } from "react";
import { getCookie } from "../../../actions/auth";
import { updateImage } from "../../../actions/birthdayList";
import ImageUpload from "../../Inputs/ImageUpload/ImageUpload";
import "../EditModal.css";

function useHandleInput(birthdayId, reloadList, closeModal) {
  const [message, setMessage] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  function handleInput(e) {
    console.log(e.target);
    if (e.target.files[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
      setUploadedImage(e.target.files[0]);
    } else {
      setImagePreview(null);
      setUploadedImage(null);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("Loading...");

    const formData = new FormData();
    if (uploadedImage !== null) {
      formData.append("updateImage", true);
      formData.append("image", uploadedImage);
    }
    updateImage(birthdayId, formData, getCookie("token"))
      .then((res) => {
        console.log(res);
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

  return { handleInput, handleSubmit, message, imagePreview };
}

const UpdateImage = ({ birthdayId, reloadList, closeModal }) => {
  const { handleInput, handleSubmit, message, imagePreview } = useHandleInput(
    birthdayId,
    reloadList,
    closeModal
  );

  return (
    <div className="modal-container">
      <section className="close-modal" onClick={closeModal}>
        <button className="close-btn">X</button>
      </section>

      <div className="modal-content">
        <h3>Update Image</h3>

        <div>{message}</div>
        <form onSubmit={handleSubmit}>
          <ImageUpload handleChange={handleInput} imagePreview={imagePreview} />

          <div className="form-group">
            <input
              disabled={message === "Loading..."}
              type="submit"
              value="Update Image"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateImage;
