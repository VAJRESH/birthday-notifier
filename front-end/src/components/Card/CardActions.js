import React, { useState } from "react";
import EditBirthday from "../UpdateBirthdayDetails/EditDetails/EditBirthday";
import UpdateImage from "../UpdateBirthdayDetails/UpdateImage/UpdateImage";

function useHandleActions() {
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [isImageModalActive, setIsImageModalActive] = useState(false);

  function toggleEditModal() {
    setIsEditModalActive(!isEditModalActive);
  }

  function toggleImageModal() {
    setIsImageModalActive(!isImageModalActive);
  }

  return {
    isEditModalActive,
    isImageModalActive,
    toggleImageModal,
    toggleEditModal,
  };
}

const CardActions = ({ item, handleEvents }) => {
  const { reloadList, handleDelete, removeImage } = handleEvents;

  const {
    isEditModalActive,
    isImageModalActive,
    toggleImageModal,
    toggleEditModal,
  } = useHandleActions();

  return (
    <section className="actions-container">
      <div className="kebab-icon"></div>
      <div className="actions">
        <p className="action-btns">
          <button className="delete-btn" onClick={() => handleDelete(item)}>
            Delete Birthday
          </button>
        </p>

        <p className="action-btns">
          <button
            className="remove-img-btn"
            onClick={() => removeImage(item._id)}
          >
            Remove Image
          </button>
        </p>

        <p className="action-btns">
          <button className="update-img-btn" onClick={toggleImageModal}>
            Update Image
          </button>
        </p>

        <p className="action-btns">
          <button onClick={toggleEditModal} className="update-btn">
            Edit Details
          </button>
        </p>
      </div>

      {isEditModalActive && (
        <EditBirthday
          birthdayData={item}
          reloadList={reloadList}
          closeModal={toggleEditModal}
        />
      )}

      {isImageModalActive && (
        <UpdateImage
          birthdayId={item._id}
          reloadList={reloadList}
          closeModal={toggleImageModal}
        />
      )}
    </section>
  );
};

export default CardActions;
