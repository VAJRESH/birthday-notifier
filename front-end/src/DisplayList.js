import React from 'react';
import avatar from "./images/default-avatar.jpg";
import { Link } from 'react-router-dom';


const month = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]

const List = props => (
  <article key={props.bd._id} className={`person ${props.bd.isBirthday}`}>
    <Link to={{
            pathname:'/image/:id',
            state: props.bd._id
        }}>
      <img src={props.bd.image} alt={props.bd.name} />
    </Link>
    <div>
        <h4>{props.bd.name}  </h4>
        <p>
          <span className="displayGender">{props.bd.gender}</span>
          <span className="displayDate">{props.bd.date} {month[props.bd.month]} {props.bd.year}</span>
          <span className="displayAge">{props.bd.age} years</span>
        </p>
        <button className='deleteBtn' id={props.bd.display} onClick={() => {props.deleteBirthday(props.bd._id)}}>Delete</button>
        <Link to={{
            pathname:'/edit/:id',
            state: props.bd._id
        }}>
            <button className='editBtn' id={props.bd.display} onClick={id => console.log(id)}>Edit</button>
        </Link>
    </div>
  </article>
);

export default List;