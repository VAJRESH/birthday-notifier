import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";

import DisplayList from './components/show-birthday-list.component';
// import AddBirthday from './components/add-birthday.component';
import EditBirthday from './components/edit-birthday.component';
import Navbar from './components/navbar/Navbar.component';
// import Register from './components/register.component';
// import Login from './components/login.component';
import AddNewBirthday from './pages/AddNewBirthday';
import BirthdayList from './pages/BirthdayList';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';

function App() {
  return (
    <Router>
      <Navbar />
      <Route path="/" exact component={DisplayList} />
      <Route path="/list/:user" exact component={BirthdayList} />
      <Route path="/add" component={AddNewBirthday} />
      <Route path="/edit/:id" component={EditBirthday} />
      <Route path="/user/register" component={Register} />
      <Route path="/user/login" component={Login} />
      <Route path="/user/logout" component={Logout} />
    </Router>
  );
}

export default App;
