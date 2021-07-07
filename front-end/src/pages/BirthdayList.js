import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCookie } from "../actions/auth";
import {
  deleteBirthday,
  getListOfUser,
  updateImage,
} from "../actions/birthdayList";
import Card from "../components/Card/Card";
import ToastMessage from "../components/ToastMessage/ToastMessage.component";
import "../css/container.css";
import { getLastNameFromUrl } from "../helpers/utils";

function useHandleActions() {
  const [list, setList] = useState([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // checks if the list belongs to the user for crud actions
    const userName = localStorage.getItem("name");
    if (userName) {
      const birthdayListUser = getLastNameFromUrl();

      setIsAuth(userName === birthdayListUser);
    }
  }, []);

  useEffect(() => {
    loadBirthdayList();
  }, []);

  function reloadList() {
    loadBirthdayList();
  }

  function filterList(e) {
    setQuery(e.target.value.toLowerCase());
  }

  function loadBirthdayList() {
    const user = getLastNameFromUrl();
    getListOfUser(user)
      .then((data) => {
        let lists = [],
          newDate = new Date(),
          year,
          bdate;

        data.birthdays.forEach((bd) => {
          year = newDate.getFullYear();
          bdate = new Date(year, bd.month, bd.date);

          if (bdate.getTime() < newDate.getTime()) {
            if (
              !(
                bdate.getMonth() === newDate.getMonth() &&
                bdate.getDate() === newDate.getDate()
              )
            ) {
              bdate.setFullYear(year + 1);
            }
          }
          bd.order = bdate.getTime() - newDate.getTime();

          lists.push(bd);
        });
        setList(lists);
      })
      .catch((err) => console.log(err));
  }

  function removeImage(birthdayId) {
    const formData = new FormData();
    updateImage(birthdayId, formData, getCookie("token"))
      .then((res) => {
        setMessage(res ? res.error || res.message : "No response");
        reloadList();

        setTimeout(() => {
          setMessage("");
        }, 1000);
      })
      .catch((err) => console.log(err));
  }

  function handleDelete(birthday) {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${birthday.name}'s birthday`
    );
    if (confirmDelete) {
      deleteBirthday(birthday._id, getCookie("token")).then((res) => {
        if (res.error) return console.log(res.err);

        setMessage(res.message);
        loadBirthdayList();
      });
    }
  }
  return {
    isAuth,
    list,
    query,
    message,
    filterList,
    reloadList,
    handleDelete,
    removeImage,
  };
}

const BirthdayList = () => {
  const {
    isAuth,
    list,
    query,
    message,
    reloadList,
    handleDelete,
    filterList,
    removeImage,
  } = useHandleActions();

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
            <input className="filterList" type="text" onChange={filterList} />
          </div>

          <div className="lists">
            {list.length !== 0 ? (
              list
                .sort((bd1, bd2) => bd1.order - bd2.order)
                .filter((person) => person.name.toLowerCase().includes(query))
                .map((person) => (
                  <Card
                    item={person}
                    isAuth={isAuth}
                    handleEvents={{
                      reloadList,
                      handleDelete,
                      removeImage,
                    }}
                    key={person._id}
                  />
                ))
            ) : (
              <div className="no-list-message">
                No Birthdays Saved. <br /> Add new Birthdays
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BirthdayList;
