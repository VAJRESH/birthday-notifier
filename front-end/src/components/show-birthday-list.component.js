import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/container.css';
import axios from 'axios';
import List from '../DisplayList'
  

export default class DisplayList extends Component {
    constructor(props){
        super(props);
        this.todayBirthdayList = [];
        this.deleteBirthday = this.deleteBirthday.bind(this);
        this.checkBirthdays = this.checkBirthdays.bind(this);

        this.state ={ birthday: []};
    }
    componentDidMount(){
        axios.get('http://localhost:4000/days/')
            .then(res => this.setState({ birthday: res.data }))
            .catch(err => {console.log(err);});
        }
    checkBirthdays(){        
        this.state.birthday.forEach(e => {
            const d = new Date();
            if(
                e.year===d.getFullYear() && 
                parseInt(e.month) === d.getMonth() &&
                e.date === d.getDate()
            ){
                this.todayBirthdayList.push(e)
            } 
            console.log(this.todayBirthdayList);
        });
        // axios.post('http://localhost:4000/days/mail',{ text: 'Hiii' })
        //     .then(res => console.log('Success:', res))
        //     .catch(err => console.log(err))
    }
    deleteBirthday(id){
        axios.delete('http://localhost:4000/days/'+id)
            .then(res => console.log(res.data));
        
        this.setState({
            birthday: this.state.birthday.filter(bd => bd._id !== id)
        })
    }
    birthdayList(){
        return this.state.birthday.map(bd => {
            return <List bd={bd} deleteBirthday={this.deleteBirthday} editBirthday={this.editBirthday} key={bd._id} />;
        });
    }
    render() {
        return (
            <div className="App">
                <main className="main-container">
                    <section className='container'>
                        <h3>
                             <span className='displayCount'>Count: {this.state.birthday.length}</span>
                            Birthdays
                        </h3>
                        <button onClick={this.checkBirthdays}>Check</button>
                        <Link to="/add">
                            <button className='addBtn' onClick={() => console.log('all working')}>
                                Add People
                            </button>
                        </Link>
                       { this.birthdayList() }
                    </section>
                </main>
            </div>
        );
    }
};