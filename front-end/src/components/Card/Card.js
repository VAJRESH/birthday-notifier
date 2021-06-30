import React from "react";
import { getAgeFromBirthday, month } from "../../helpers/utils";
import "./Card.css";
import CardActions from "./CardActions";

const Card = ({ item, isAuth, handleEvents }) => {
  return (
    <div className={`person ${item.isBirthday}`} key={item._id}>
      <div id={item.isBirthday.toString()}>Happy Birthday!!</div>

      {isAuth && <CardActions item={item} handleEvents={handleEvents} />}

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
