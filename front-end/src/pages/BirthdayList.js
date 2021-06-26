import React, { useState, useEffect } from "react";
import { getListOfUser } from "../actions/birthdayList";
import "../css/container.css";
import Card from "../components/Card/Card";
import {Link} from "react-router-dom";

const BirthdayList = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const url = window.location.pathname.split("/");
    const user = url[url.length - 1];
    getListOfUser(user)
      .then((data) => setList(data.birthdays))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="App">
      <main className="main-container">
        <section className="container">
          <h3>Birthdays</h3>

          <div className="info">
            <span className="displayCount">Count: {list.length}</span>
          </div>

          <Link to="/add">
            <button className="addBtn">Add People</button>
          </Link>

          <div className="filters">
            <label className="searchBarLabel">Search: </label>
            <input
              className="filterList"
              //   value={this.state.search}
              type="text"
              //   onChange={this.onChangeInput}
            />
          </div>

          <div className="lists">
            {list ? (
              list.map((person) => <Card item={person} />)
            ) : (
              <>No Birthdays Saved. Add new Birthdays</>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BirthdayList;
