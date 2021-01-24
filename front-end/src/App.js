import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";

import DisplayList from './components/show-birthday-list.component';
import AddBirthday from './components/add-birthday.component';
import EditBirthday from './components/edit-birthday.component';
import AddImage from './components/add-image.component';

function App() {
  return (
    <Router>
      <Route path="/" exact component={DisplayList} />
      <Route path="/add" component={AddBirthday} />
      <Route path="/edit/:id" component={EditBirthday} />
      <Route path="/image/:id" component={AddImage} />
      {/* <Route path="/user" component={CreateUser} /> */}
    </Router>
  );
}

export default App;
