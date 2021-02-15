import React, { Component } from 'react';
import axios from 'axios';
import List, { capitalize, DisplayMessage, limit } from '../utils/functions_for_components';

export default class EditBirthday extends Component {
    constructor(props){
        super(props);
        this.isLoggedIn = localStorage.getItem('isLoggedIn');

        this.id = props.location.state;
        this.state = {
            oldEntries: {
                id: props.location.state,
                name: '',
                age: 0,
                gender: '',
                date: 0,
                month: 0,
                year: 0,
                isBirthday: false,
                image: ''
            },
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
            image: '',
            display: "hideComponent"
        };
        
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeGender = this.onChangeGender.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        
    }
    componentDidMount(){
        axios.get('/days/'+this.state.oldEntries.id)
            .then(res => {
                this.setState({
                    oldEntries: {
                        name: res.data.name,
                        age: res.data.age,
                        gender: res.data.gender,
                        date: res.data.date,
                        month: res.data.month,
                        year: res.data.year,
                        isBirthday: res.data.isBirthday,
                        image: res.data.image
                    },
                });
            });
    }
    displayLastEntry(){
        return <List bd={this.state.oldEntries} isLoggedIn={this.isLoggedIn} id={this.state.display} key={this.state.oldEntries.id} />;
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
        if(((currentMonth<=birthMonth)){
            if((currentMonth === birthMonth) && (currentDate === birthDate)){
                yearAge++;
            }
            if(currentMonth < birthMonth) yearAge--;
            if(currentMonth === birthMonth && currentDate <= birthDate) yearAge--;
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
        const birthdays = new FormData();
        birthdays.append('name', capitalize(this.state.name));
        birthdays.append('age', this.state.age);
        birthdays.append('gender', this.state.gender);
        birthdays.append('date', this.state.birthDate);
        birthdays.append('month', this.state.month);
        birthdays.append('year', this.state.year);
        birthdays.append('isBirthday', this.state.isBirthday);
        birthdays.append('image', this.state.image);
        if(birthdays.get('name') === ''){
            console.log('sa')
            birthdays.set('name', capitalize(this.state.oldEntries.name));
        }
        if(birthdays.get('gender')===''){
            console.log('sa')
            birthdays.set('gender', this.state.oldEntries.gender);
        }
        if(parseInt(birthdays.get('date')) === 0){
            const dob = new Date(
                this.state.oldEntries.year,
                this.state.oldEntries.month,
                this.state.oldEntries.date,
            );
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
            birthdays.set('age', yearAge);
            birthdays.set('date',this.state.oldEntries.date);
            birthdays.set('month', this.state.oldEntries.month);
            birthdays.set('year', this.state.oldEntries.year);
            birthdays.set('isBirthday', this.state.oldEntries.isBirthday);
        }
        if(birthdays.get('image') === ''){
            birthdays.append('imagePath', this.state.oldEntries.image);
        }
        console.log(...birthdays)
        axios.post('/days/update/'+this.id, birthdays)
            .then(res => {
                this.setState({
                    className: 'displayMessage',
                    message: res.data.message
                });
            });
        setTimeout(() => {
            window.location.href = '/';  
            this.setState({
                className: '',
                message: ''
            })
        }, 1000);
    }

    render() {
        return (
            <div className="main-container">
                <DisplayMessage className={`hideMessage ${this.state.className}`} key={Date.now()+this.state.oldEntries.id} message={this.state.message}/>
                <form onSubmit={this.onSubmit} className="container">
                    <h3>Enter Details</h3>
                    <button onClick={() => {window.location = '/'}} id="backBtn">Back</button>
                    <div className='lastEntry'>
                        {this.displayLastEntry()}
                    </div>
                    <h4> Change Any Field. </h4>

                    <div className="form-group">
                        <label>Name: </label>
                        <input type="text"
                        placeholder={this.state.oldEntries.name}
                        className="input"
                        value={this.state.name}
                        onChange={this.onChangeName}/>
                    </div>

                    <div className="form-group">
                        <label>Gender: </label>
                        <select className="input" value={this.state.gender} onChange={this.onChangeGender}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Date:</label>
                        <input type="date"
                        className="input"
                        max={limit()}
                        value={this.state.date}
                        onChange={this.onChangeDate}
                        />
                    </div>

                    <div className="form-group">
                        <label>Image:</label>
                        <input type="file"
                        className='input'
                        onChange={this.onChangeImage}
                        />
                    </div>

                    <div className="form-group">
                        <input type='submit' value="Edit Birthday" className="btn btn-primary"/>
                    </div>

                </form>
            </div>
        );
    }
}
