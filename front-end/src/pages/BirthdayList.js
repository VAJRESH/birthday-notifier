import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getListOfUser, deleteBirthday } from "../actions/birthdayList";
import { getCookie } from "../actions/auth";
import Card from "../components/Card/Card";
import "../css/container.css";
import ToastMessage from "../components/ToastMessage/ToastMessage.component";

function useHandleActions() {
  const [list, setList] = useState([]);
  const [message, setMessage] = useState();

  useEffect(() => {
    loadBirthdayList();
  }, []);

  function loadBirthdayList() {
    const url = window.location.pathname.split("/");
    const user = url[url.length - 1];
    getListOfUser(user)
      .then((data) => setList(data.birthdays))
      .catch((err) => console.log(err));
  }

  function handleDelete(birthday) {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${birthday.name}'s birthday`
    );
    if (confirmDelete) {
      deleteBirthday(birthday._id, getCookie("token")).then((res) => {
        console.log(res);
        if (res.error) return console.log(res.err);

        setMessage(res.message);
        loadBirthdayList();
      });
    }
  }
  return { list, message, handleDelete };
}

const BirthdayList = () => {
  const { list, message, handleDelete } = useHandleActions();

  return (
    <div className="App">
      <main className="main-container">
        <ToastMessage message={message} />
        
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
              list.map((person) => (
                <Card
                  item={person}
                  key={person._id}
                  handleDelete={handleDelete}
                />
              ))
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
