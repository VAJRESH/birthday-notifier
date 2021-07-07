import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar.component";
import AddNewBirthday from "./pages/AddNewBirthday";
import BirthdayList from "./pages/BirthdayList";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Navbar />
      <Route path="/" exact component={Home} />
      <Route path="/list/:user" exact component={BirthdayList} />
      <Route path="/user/register" component={Register} />
      <Route path="/user/login" component={Login} />
      <Route path="/profile/:name" component={Profile} />
      <Route path="/add" component={AddNewBirthday} />
      <Route path="/user/logout" component={Logout} />
    </Router>
  );
}

export default App;
