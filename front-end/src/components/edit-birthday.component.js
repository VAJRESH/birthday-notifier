import React, { Component } from 'react';
import axios from 'axios';
import List from '../DisplayList';

export default class EditBirthday extends Component {
    constructor(props){
        super(props);
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
                image: '',
                display: ""
            },
            name: "",
            age: 0,
            gender: 'Male',
            date: new Date(),
            birthDate: 0,
            month: 0,
            year: 0,
            isBirthday: false,
            image: ''
        };
        
        
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeGender = this.onChangeGender.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        
    }
    componentDidMount(){
        axios.get('http://localhost:4000/days/'+this.state.oldEntries.id)
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
                        image: res.data.image,
                        display: "hideBtn"
                    },
                });
            });
    }
    displayLastEntry(){
        return <List bd={this.state.oldEntries} key={this.state.oldEntries.id} />;
    }
    onChangeName(e){
        this.setState({
            name: e.target.value
        });
    }
    onChangeGender(e){
        console.log(e.target.value);
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
        if(!((currentMonth>=birthMonth) && (currentDate>=birthDate))){
            yearAge--;
        }
        console.log(yearAge);
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
    capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    onSubmit(e){
        e.preventDefault();
        const birthdays = new FormData();
        birthdays.append('name', this.capitalize(this.state.name));
        birthdays.append('age', this.state.age);
        birthdays.append('gender', this.state.gender);
        birthdays.append('date', this.state.birthDate);
        birthdays.append('month', this.state.month);
        birthdays.append('year', this.state.year);
        birthdays.append('isBirthday', this.state.isBirthday);
        birthdays.append('image', this.state.image);
        // const birthdays = {
        //     name: this.capitalize(this.state.name),
        //     age: this.state.age,
        //     gender: this.state.gender,
        //     date: this.state.birthDate,
        //     month: this.state.month,
        //     year: this.state.year,
        //     isBirthday: this.state.isBirthday
        // }
        if(birthdays.name === ''){
            birthdays.set("name", this.state.oldEntries.name);
        }
        if(birthdays.gender===''){
            birthdays.set('gender', this.state.oldEntries.gender);
        }
        if(birthdays.date === 0){
            e = {"target":{"value": this.state.date}};
            this.onChangeDate(e)
            birthdays.set('age', this.state.oldEntries.age);
            birthdays.set('date',this.state.oldEntries.date);
            birthdays.set('month', this.state.oldEntries.month);
            birthdays.set('year', this.state.oldEntries.year);
            birthdays.set('isBirthday', this.state.isBirthday);
        }
        if(birthdays.image === undefined){
            birthdays.append('imagePath', this.state.oldEntries.image);
        }
        
        console.log(birthdays.image);

        axios.post('http://localhost:4000/days/update/'+this.id, birthdays)
            .then(res => console.log(res.data));
        window.location = '/';
        this.setState({
            name: '',
            gender: '',
            date: ''
        });
    }

    render() {
        return (
            <div className="main-container">
                <form onSubmit={this.onSubmit} className="container">
                    <h3>Enter Details</h3>
                    <button onClick={() => {window.location = '/'}} id="back-btn">Back</button>
                    {this.displayLastEntry()}
                    <p> Change Any Field. </p>
                    <div className="form-group">
                        <label>Name: </label>
                        <input type="text"
                        placeholder={this.state.oldEntries.name}
                        className="form-control"
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
                        value={this.state.date}
                        onChange={this.onChangeDate}
                        />
                    </div>
                    <div className="form-group">
                        <label>Image:</label>
                        <input type="file"
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