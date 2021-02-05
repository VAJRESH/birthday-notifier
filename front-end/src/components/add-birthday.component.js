import React, { Component } from 'react';
import axios from 'axios';
import { capitalize, DisplayMessage, limit } from '../utils/functions_for_components';

export default class AddBirthday extends Component {
    constructor(props){
        super(props);
        this.isLoggedIn = localStorage.getItem('isLoggedIn');
        
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeGender = this.onChangeGender.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            className: "",
            message: "",
            name: "",
            age: 0,
            gender: 'Male',
            date: new Date(),
            birthDate: 0,
            month: 0,
            year: 0,
            isBirthday: false,
            imageValue: '',
            image: '',
            isLoggedIn: this.isLoggedIn
        };
    }
    componentDidUpdate(){
        if(this.state.className !== ''){
            setTimeout(() => {
                this.setState({
                    className: '',
                    message: '',
                    name: '',
                    date: '',
                    image: '',
                    isBirthday: false,
                    imageValue: ''
                });
            }, 1000);
        }
    }
    onChangeName(e){
        this.setState({
            name: e.target.value
        });
    }
    onChangeGender(e){
        this.setState({
            gender: e.target.value
        });
    }
    onChangeDate(e){
        const dob = new Date(e.target.value);
        const date = new Date();

        const birthYear = dob.getFullYear();
        const birthMonth = dob.getMonth();
        const birthDate = dob.getDate();
        
        const currentYear = date.getFullYear();
        const currentMonth = date.getMonth();
        const currentDate = date.getDate();

        let yearAge = currentYear-birthYear;
        if(((currentMonth<=birthMonth) && (currentDate<birthDate))){
            yearAge--;
        }
        this.setState({
            age: yearAge,
            date: e.target.value,
            birthDate: birthDate,
            month: birthMonth,
            year: birthYear
        });
        if(
            birthYear===currentYear && 
            birthMonth === currentMonth &&
            birthDate === currentDate
        ){
            this.setState({
                isBirthday: true
            })
        }
    }
    onChangeImage(e){
        this.setState({
            imageValue: e.target.value,
            image: e.target.files[0]
        })
    }
    loading(){
        this.setState({
            className: 'displayMessage',
            message: 'Loading..'
        })
    }
    onSubmit(e){
        e.preventDefault();
        this.loading();
        if(this.isLoggedIn){
            const birthdays = new FormData();
            birthdays.append('name', capitalize(this.state.name));
            birthdays.append('age', this.state.age);
            birthdays.append('gender', this.state.gender);
            birthdays.append('date', this.state.birthDate);
            birthdays.append('month', this.state.month);
            birthdays.append('year', this.state.year);
            birthdays.append('isBirthday', this.state.isBirthday);
            birthdays.append('image', this.state.image);
            axios.post('/days/add', birthdays)
                .then(res => {
                    this.setState({
                        className: 'displayMessage',
                        message: res.data.message
                    });
                }).catch(err => {
                    this.setState({
                        className: 'displayMessage',
                        message: err
                    });
                });
        } else {            
            this.setState({
                className: 'displayMessage',
                message: `Login or Register!!`
            });
        }
    }

    render() {
        return (
            <div className="main-container">
                <div className='container'>
                    <div className='messageContainer'>
                        <DisplayMessage className={`hideMessage ${this.state.className}`} key={Date.now()+'something'} message={this.state.message}/>
                    </div>
                    <h3>Enter Details</h3>
                    <button onClick={() => {window.location.href = '/'}} id="backBtn">Back</button>
                    <form onSubmit={this.onSubmit}>


                        <div className="form-group">
                            <label>Name: </label>
                            <input type="text"
                            required
                            placeholder="Enter Name"
                            className="input"
                            value={this.state.name}
                            onChange={this.onChangeName}/>
                        </div>

                        <div className="form-group">
                            <label>Gender: </label>
                            <select className="input" onChange={this.onChangeGender}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Date: </label>
                            <input type="date"
                            required
                            className="input"
                            max={limit()}
                            value={this.state.date}
                            onChange={this.onChangeDate}
                            />
                        </div>

                        <div className="form-group">
                            <label>Image:</label>
                            <input type="file"
                            className="input"
                            value={this.state.imageValue}
                            onChange={this.onChangeImage}
                            />
                        </div>

                        <div className="form-group">
                            <input type='submit' value="Add Birthday" className="btn btn-primary"/>
                        </div>

                    </form>
                </div>
            </div>
        );
    }
}