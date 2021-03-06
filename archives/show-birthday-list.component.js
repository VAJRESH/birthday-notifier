import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/container.css';
import axios from 'axios';
import List, { DisplayMessage } from './utils/functions_for_components';

function getAge(data){
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();
    let yearAge = currentYear - data.year;
    if(currentMonth<=data.month && currentDate<=data.date){
        if(currentMonth===data.month && currentDate===data.date){
            ++yearAge;
        }
        --yearAge;
    }
    return yearAge;
}

export default class DisplayList extends Component {
    constructor(props){
        super(props);
        this.isLoggedIn = localStorage.getItem('isLoggedIn');
        this.email = localStorage.getItem('email');

        this.todayBirthdayList = [];
        this.deleteBirthday = this.deleteBirthday.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onChangeAddPeople = this.onChangeAddPeople.bind(this);
        this.updateList = this.updateList.bind(this);
        this.state ={ 
            birthday: [],
            search: '',
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
            axios.get('/days/')
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
            }, 1000);
        }
    }
    onChangeInput(e){
        this.setState({
            search: e.target.value.toLowerCase()
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
            axios.delete('/days/'+id)
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
        let lists = [], newDate = new Date(), year, bdate;

        this.state.birthday
        .forEach(bd => {
            year = newDate.getFullYear();
            bdate = new Date(year, bd.month, bd.date);
            if(bdate.getTime()<newDate.getTime()){
                if(
                    !(bdate.getMonth() === newDate.getMonth() &&
                    bdate.getDate() === newDate.getDate())
                    ){
                        bdate.setFullYear(year+1);
                    }
            }
            bd.order = bdate.getTime() - newDate.getTime();
            lists.push(bd);
        })
        return lists
        .sort((a,b) => a.order-b.order)
        .filter(bd => this.state.search === '' || bd.name.toLowerCase().includes(this.state.search))
        .map(bd => {
            return <List bd={bd} isLoggedIn={this.isLoggedIn} deleteBirthday={this.deleteBirthday} editBirthday={this.editBirthday} key={bd._id} className='listContainer'/>;
        });
    }
    updateList(){
        axios.get('/days/')
            .then(res => {
                const list = res.data;
                const d = new Date();
                list.forEach(bd => {
                    let yearAge = getAge(bd);
                    if(
                        parseInt(bd.month) === d.getMonth() &&
                        bd.date === d.getDate()
                        ){
                            console.log('inside here');
                            if(!bd.isBirthday){
                                let update = {
                                    isBirthday: true,
                                    age: yearAge
                                }
                                axios.post('/days/update/isBirthday/'+bd._id, update)
                                    .then(res => console.log(res.data))
                                    .catch(err => console.log(err));
                            }
                        } else if(bd.isBirthday){
                            console.log('gone')
                            let update = {
                                isBirthday: false,
                                age: yearAge
                            }
                            axios.post('/days/update/isBirthday/'+bd._id, update)
                                .then(res => console.log(res.data))
                                .catch(err => console.log(err));
                        }
                })
            })
            .catch(err => console.log(err));
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
                             <span>
                                 <button className='displayButton' onClick={this.updateList}>Update List</button>
                             </span>
                             <span className='displayLoginStatus'>{ loginStatus }</span>
                        </div>

                        <button className='addBtn' onClick={this.onChangeAddPeople}>
                            Add People
                        </button>
                        <div className='filters'>
                            <label className='searchBarLabel'>Search: </label>
                            <input className='filterList' value={this.state.search} type='text' onChange={this.onChangeInput}/>
                        </div>
                        <div className='lists'>
                            {/* { this.birthdayList() } */}
                        </div>
                    </section>
                </main>
            </div>
        );
    }
};