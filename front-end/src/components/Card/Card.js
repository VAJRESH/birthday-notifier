import React from "react";
import { Link } from "react-router-dom";
import { getAgeFromBirthday } from "../../helpers/utils";
import "./Card.css";

const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Card = ({ item }) => {
  return (
    <div className={`person ${item.isBirthday}`}>
      <div id={item.isBirthday.toString()}>Happy Birthday!!</div>

      <section className="actions-container">
        <div className="kebab-icon"></div>
        <div className="actions">
          <p className="action-btns">
            <button className="delete-btn">Delete Birthday</button>
          </p>
          <p className="action-btns">
            <button className="remove-img-btn">Remove Image</button>
          </p>
          <p className="action-btns">
            <button className="update-img-btn">Update Image</button>
          </p>
          <p className="action-btns">
            <Link
              to={{
                pathname: "/edit",
                state: item,
              }}
              className="update-btn"
            >
              Edit Details
            </Link>
          </p>
        </div>
      </section>

      <img src={item.image} alt={item.name} />
      <section className="details">
        <h4>{item.name}</h4>
        <section>
          <p className="displayGender">{item.gender}</p>
          <br />
          <p className="displayDate">
            {item.date}{" "}
            {window.innerWidth < 500
              ? month[item.month].slice(0, 3)
              : month[item.month]}{" "}
            {item.year}
          </p>
          <br />
          <p className="displayAge">
            {getAgeFromBirthday(item.date, item.month, item.year)} years
          </p>
          <br />
        </section>
      </section>
    </div>
  );
};

export default Card;
