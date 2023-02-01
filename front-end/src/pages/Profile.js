import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCookie, update } from "../actions/auth";
import { getUserDetails } from "../actions/user";
import InputSection from "../components/Inputs/InputSection";
import ToastMessage from "../components/ToastMessage/ToastMessage.component";
import { getLastNameFromUrl } from "../helpers/utils";

function useManageUserDetails(allEmailLists, setEmails) {
  const [profileDetails, setProfileDetails] = useState({});
  const [updatedData, setUpdatedData] = useState({
    name: "",
    email: "",
    emailList: [],
  });
  const [message, setMessage] = useState();

  useEffect(() => {
    setUpdatedData({ ...updatedData, emailList: allEmailLists });
  }, [allEmailLists]);

  useEffect(() => {
    const name = getLastNameFromUrl();

    // demo account
    if (name === "demo")
      return setMessage("Cannot view or edit demo account!!");

    if (name === localStorage.getItem("name")) {
      getUserDetails(name).then((res) => {
        setProfileDetails(res || {});
        setUpdatedData(res || {});
        setEmails((prev) => ({ ...prev, items: res?.emailList }));
      });
    } else {
      setMessage("You can only see your profile. Please login");
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
    const { name, email, password, emailList } = updatedData;

    const formData = new FormData();
    name && formData.append("name", name);
    email && formData.append("email", email);
    password && formData.append("password", password);
    formData.append("emailList", emailList);

    update(formData, getCookie("token")).then((res) => {
      console.log(res);
      setMessage(res ? res.error || res.message : "No response");

      if (res && res.updatedData) {
        localStorage.setItem("name", updatedData.name);
        localStorage.setItem("email", updatedData.email);

        // window.location.replace(`/profile/${updatedData.name}`);
      }
    });
  }

  return {
    profileDetails,
    updatedData,
    handleInput,
    handleSubmit,
    message,
    setUpdatedData,
  };
}

export default function Profile() {
  const {
    emails,
    setEmails,
    handleChange,
    handleDelete,
    handleKeyDown,
    handlePaste,
  } = useHandleMultiEmail();

  const { profileDetails, updatedData, handleInput, handleSubmit, message } =
    useManageUserDetails(emails?.items, setEmails);

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

            <div className="email-container">
              <span className="tag-item">{updatedData?.email}</span>

              {emails?.items?.map((item) => (
                <div className="tag-item" key={item}>
                  {item}
                  <span className="button" onClick={() => handleDelete(item)}>
                    &times;
                  </span>
                </div>
              ))}
            </div>

            <InputSection
              label={"Emails to Notify"}
              value={emails?.value}
              example="Type or paste email addresses and press `Enter`..."
              handleChange={handleChange}
              isNotRequired={true}
              inputProps={{
                className: "input " + (emails?.error && " has-error"),
                onKeyDown: handleKeyDown,
                onPaste: handlePaste,
              }}
            />

            {emails?.error && <p className="error">{emails?.error}</p>}

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
}

function useHandleMultiEmail() {
  const [emails, setEmails] = React.useState({
    items: [],
    value: "",
    error: null,
  });

  function handleKeyDown(evt) {
    if (["Enter", "Tab", ","].includes(evt.key)) {
      evt.preventDefault();

      var value = emails.value.trim();

      if (value && isValid(value)) {
        setEmails({
          ...emails,
          items: [...emails?.items, emails?.value],
          value: "",
        });
      }
    }
  }

  function handleChange(evt) {
    setEmails({ ...emails, value: evt.target.value, error: null });
  }

  function handleDelete(item) {
    setEmails({ ...emails, items: emails?.items.filter((i) => i !== item) });
  }

  function handlePaste(evt) {
    evt.preventDefault();

    var paste = evt.clipboardData.getData("text");
    var emails = paste.match(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g);

    if (emails) {
      var toBeAdded = emails.filter((email) => !isInList(email));

      setEmails({ ...emails, items: [...emails?.items, ...toBeAdded] });
    }
  }

  function isValid(email) {
    let error = null;

    if (isInList(email)) {
      error = `${email} has already been added.`;
    }

    if (!isEmail(email)) {
      error = `${email} is not a valid email address.`;
    }

    if (error) {
      setEmails({ ...emails, error });

      return false;
    }

    return true;
  }

  function isInList(email) {
    return emails?.items.includes(email);
  }

  function isEmail(email) {
    return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
  }

  return {
    emails,
    setEmails,
    handleChange,
    handleDelete,
    handleKeyDown,
    handlePaste,
  };
}
