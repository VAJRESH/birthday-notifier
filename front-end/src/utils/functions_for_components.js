import React from 'react';
import { Link } from 'react-router-dom';

const month = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]

const List = function(props) {
  let buttons;
  if(props.isLoggedIn){
    buttons = (
      <div className='buttons'>
          <button className='deleteBtn' id={props.id} onClick={() => {props.deleteBirthday(props.bd._id)}}>Delete</button>

          <Link to={{
              pathname:'/edit/:id',
              state: props.bd._id
            }}>
              <button className='editBtn' id={props.id} onClick={id => console.log(id)}>Edit</button>
          </Link>
      </div>
    )
  } else {
    buttons = <span></span>
  }
  return (
    <article key={props.bd._id} className={`person ${props.bd.isBirthday}`}>
      <Link to={{
              pathname:'/image/:id',
              state: props.bd._id
          }}>
        <img src={props.bd.image} alt={props.bd.name} />
      </Link>
      <div className='details'>
          <h4>{props.bd.name}</h4>
          <section>
            <p className="displayGender">{props.bd.gender}</p><br/>
            <p className="displayDate">{props.bd.date} {window.innerWidth < 500 ? month[props.bd.month].slice(0, 3) : month[props.bd.month]} {props.bd.year}</p><br/>
            <p className="displayAge">{props.bd.age} years</p><br/>
          </section>
      </div>
      { buttons }
    </article>
  )
};

const DisplayMessage = props => (
  <h4 className={props.className} id={props.id}>
      {props.message}
  </h4>
)

const LogOutButton = props => (
  <div>
      <button onClick={props.onClick} id='registerBtn'>
          Log Out
      </button>
  </div>
)

function capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default List;
export {
  capitalize,
  DisplayMessage,
  LogOutButton
};