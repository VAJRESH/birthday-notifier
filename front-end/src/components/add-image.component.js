import React, { Component } from 'react';
import axios from 'axios';
import List from '../utils/functions_for_components';

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
                month: '',
                year: 0,
                isBirthday: false,
                display: "",
                image: '',
            },
            name: "",
            age: 0,
            gender: 'Male',
            date: new Date(),
            birthDate: 0,
            month: '',
            year: 0,
            isBirthday: false,
            image: '',
        };
        
        
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
                        display: "hideBtn",
                        image: res.data.image
                    },
                });
            });
    }
    displayLastEntry(){
        return <List bd={this.state.oldEntries} key={this.state.oldEntries.id} />;
    }
    onChangeImage(e){
        this.setState({
            image: e.target.files[0]
        })
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
    capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    onSubmit(e){
        e.preventDefault();
        const birthdays = new FormData();
        birthdays.append('name', this.capitalize(this.state.oldEntries.name));
        birthdays.append('age', this.state.oldEntries.age);
        birthdays.append('gender', this.state.oldEntries.gender);
        birthdays.append('date', this.state.oldEntries.date);
        birthdays.append('month', this.state.oldEntries.month);
        birthdays.append('year', this.state.oldEntries.year);
        birthdays.append('isBirthday', this.state.oldEntries.isBirthday);
        birthdays.append('image', this.state.image);
        // {
            // name: this.capitalize(this.state.name),
            // age: this.state.age,
            // gender: this.state.gender,
            // date: this.state.birthDate,
            // month: this.state.month,
            // year: this.state.year,
            // isBirthday: this.state.isBirthday,
            // image: this.state.image
        // }
        // if(birthdays.name === ''){
        //     birthdays.name = this.state.oldEntries.name;
        // }
        // if(birthdays.gender===''){
        //     birthdays.gender = this.state.oldEntries.gender;
        // }
        // if(birthdays.date === 0){
        //     e = {"target":{"value": this.state.date}};
        //     // this.onChangeDate(e)
        //     birthdays.age = this.state.oldEntries.age;
        //     birthdays.date = this.state.oldEntries.date;
        //     birthdays.month = this.state.oldEntries.month;
        //     birthdays.year = this.state.oldEntries.year;
        //     birthdays.isBirthday = this.state.isBirthday;
        // }
        
        console.log(birthdays);

        axios.post('http://localhost:4000/days/update/'+this.id, birthdays)
            .then(res => console.log(res.data));
        // window.location = '/';
        this.setState({
            image: ''
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
                    <div>
                        <label>Image: </label>
                        <input type="file"
                        onChange={this.onChangeImage}
                        />
                    </div>
                    <div className="form-group">
                        <input type='submit' value="Add Image" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        );
    }
}