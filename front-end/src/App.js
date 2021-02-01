import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";

import DisplayList from './components/show-birthday-list.component';
import AddBirthday from './components/add-birthday.component';
import EditBirthday from './components/edit-birthday.component';
import Register from './components/register.component';
import Login from './components/login.component';

function App() {
  return (
    <Router>
      <Route path="/" exact component={DisplayList} />
      <Route path="/add" component={AddBirthday} />
      <Route path="/edit/:id" component={EditBirthday} />
      <Route path="/user/register" component={Register} />
      <Route path="/user/login" component={Login} />
    </Router>
  );
}

export default App;
