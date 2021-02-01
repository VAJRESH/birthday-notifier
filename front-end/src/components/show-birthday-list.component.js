import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/container.css';
import axios from 'axios';
import List, { DisplayMessage } from '../utils/functions_for_components';
  

export default class DisplayList extends Component {
    constructor(props){
        super(props);
        this.isLoggedIn = localStorage.getItem('isLoggedIn');
        this.email = localStorage.getItem('email');

        this.todayBirthdayList = [];
        this.deleteBirthday = this.deleteBirthday.bind(this);
        this.onChangeSearchName = this.onChangeSearchName.bind(this);
        this.onChangeAddPeople = this.onChangeAddPeople.bind(this);
        this.state ={ 
            birthday: [],
            searchName: '',
            className: '',
            message: '',
            classes: {
                deleteButton: '',
                editButton: ''
            },
            email: this.email,
            isLoggedIn: this.isLoggedIn,
            display: 'hideComponent'
        };
    }
    componentDidMount(){
        this.loading();
        if(this.state.birthday.length === 0){
            axios.get('http://localhost:4000/days/')
                .then(res => this.setState({ birthday: res.data }))
                .catch(err => console.log(err));
        }
            
        if(this.isLoggedIn){
            this.setState({
                email: this.email,
                display: ''
            })
        } else {
            this.setState({
                isLoggedIn: false,
            })
        }
    }
    componentDidUpdate(){
        if(this.state.className !== ''){
            setTimeout(() => {
                this.setState({
                    className: '',
                    message: ''
                })
            }, 2000);
        }
    }
    onChangeSearchName(e){
        this.setState({
            searchName: e.target.value.toLowerCase()
        })
    }
    onChangeAddPeople(){
        if(this.state.isLoggedIn){
            this.props.history.push({
                pathname: '/add',
                state: { isLoggedIn: this.state.isLoggedIn}
            })
        } else {
            this.setState({
                className: 'displayMessage',
                message: 'Please Login to Add new Birthdays.'
            })
        }
    }
    loading(){
        this.setState({
            className: 'displayMessage',
            message: 'Loading..'
        })
    }
    deleteBirthday(id){
        this.loading();
        if(this.state.isLoggedIn){
            axios.delete('http://localhost:4000/days/'+id)
                .then(res => {
                    this.setState({
                        className: 'displayMessage',
                        message: res.data.message,
                        birthday: this.state.birthday.filter(bd => bd._id !== id)
                    });
                }).catch(err => {
                    this.setState({
                        className: 'displayMessage',
                        message: err,
                    });
                })
        } else {
            console.log('register or login')
            this.setState({
                className: 'displayMessage',
                message: 'Please Login to Delete Birthdays.'
            })
        }
    }
    birthdayList(){
        let newDate = new Date(), year, sortedList = [];
        this.state.birthday
        .forEach(bd => {
            year = newDate.getFullYear();
            let birthDate = new Date(year, bd.month, bd.date);
            if(birthDate.getTime()<newDate.getTime()){
                birthDate.setFullYear(year+1);
                if(
                    birthDate.getMonth() === newDate.getMonth() && 
                    birthDate.getDate() === newDate.getDate()
                    ){
                        birthDate.setFullYear(year);
                }
            }
            // arr.push(a1);
            bd.fromNow = (new Date().getTime()- birthDate.getTime());
            sortedList.push(bd)
            sortedList.sort((a,b) => b.fromNow-a.fromNow);
        });
        return sortedList
        .filter(bd => this.state.searchName === '' || bd.name.toLowerCase().includes(this.state.searchName))
        .map(bd => {
            return <List bd={bd} isLoggedIn={this.isLoggedIn} deleteBirthday={this.deleteBirthday} editBirthday={this.editBirthday} key={bd._id} className='listContainer'/>;
        });
    }
    render() {
        let loginStatus;
        if(this.isLoggedIn){
           loginStatus = 'Logged In';
        } else {
            loginStatus = 'Not Logged In';
        }
        return (
            <div className="App">
                <main className="main-container">
                    <div id='loginContainer'>
                        <DisplayMessage className={`hideMessage ${this.state.className}`} key={Date.now()+''} message={this.state.message}/>
                        <Link to='/user/login'>
                            <button id='loginBtn'>
                                Login
                            </button>
                        </Link>
                        <Link to='/user/register'>
                            <button id='registerBtn'>
                                Register
                            </button>
                        </Link>
                    </div>
                    <section className='container'>
                        <h3>
                            Birthdays
                      </h3>
                        <div className='info'>
                             <span className='displayCount'>Count: {this.state.birthday.length}</span>
                             <span className='displayLoginStatus'>{ loginStatus }</span>
                        </div>

                        <button className='addBtn' onClick={this.onChangeAddPeople}>
                            Add People
                        </button>
                        <div className='filters'>
                            <label className='searchBarLabel'>Search: </label>
                            <input className='filterList' value={this.state.searchName} placeholder='By Name' type='text' onChange={this.onChangeSearchName}/>
                        </div>
                        <div className='lists'>
                            { this.birthdayList() }
                        </div>
                    </section>
                </main>
            </div>
        );
    }
};