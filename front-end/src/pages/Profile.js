import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCookie, update } from "../actions/auth";
import { getUserDetails } from "../actions/user";
import InputSection from "../components/Inputs/InputSection";
import ToastMessage from "../components/ToastMessage/ToastMessage.component";
import { getLastNameFromUrl } from "../helpers/utils";

function useManageUserDetails() {
  const [profileDetails, setProfileDetails] = useState({});
  const [updatedData, setUpdatedData] = useState({
    name: "",
    email: "",
  });
  const [message, setMessage] = useState();

  useEffect(() => {
    const name = getLastNameFromUrl();

    // demo account
    if (name === "Demo")
      return setMessage("Cannot view or edit demo account!!");

    if (name === localStorage.getItem("name")) {
      getUserDetails(name).then((res) => {
        setProfileDetails(res || {});
        setUpdatedData(res || {});
      });
    } else {
      setMessage('You can only see your profile. Please login')
    }
  }, []);

  function handleInput(e) {
    setMessage();
    setUpdatedData({
      ...updatedData,
      [e.target.name.toLowerCase()]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { name, email, password } = updatedData;

    const formData = new FormData();
    name && formData.append("name", name);
    email && formData.append("email", email);
    password && formData.append("password", password);

    update(formData, getCookie("token")).then((res) => {
      console.log(res);
      setMessage(res ? res.error || res.message : "No response");

      if (res && res.updatedData) {
        localStorage.setItem("name", updatedData.name);
        localStorage.setItem("email", updatedData.email);

        window.location.replace(`/profile/${updatedData.name}`);
      }
    });
  }

  return { profileDetails, updatedData, handleInput, handleSubmit, message };
}

const Profile = () => {
  const { profileDetails, updatedData, handleInput, handleSubmit, message } =
    useManageUserDetails();

  return (
    <div className="main-container">
      <ToastMessage message={message} />

      <section className="container">
        <h1 className="heading">{profileDetails.name}</h1>

        {profileDetails.name ? (
          <form onSubmit={handleSubmit}>
            <InputSection
              label="Name"
              inputType="text"
              value={updatedData.name}
              isNotRequired
              handleChange={handleInput}
            />
            <InputSection
              label="Email"
              inputType="email"
              value={updatedData.email}
              isNotRequired
              handleChange={handleInput}
            />
            <InputSection
              label="Password"
              inputType="password"
              example="Update password"
              isNotRequired
              handleChange={handleInput}
            />

            <div className="form-group">
              <input
                type="submit"
                value="Update Details"
                className="btn btn-primary"
              />
            </div>
          </form>
        ) : (
          <>
            <div className="message-info">{message}</div>
            <div className="form-group">
              <Link to="/user/login" style={{ gridColumn: "1/3" }}>
                <input type="submit" value="Login Here" />
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Profile;
