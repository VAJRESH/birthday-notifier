import React, { Component } from 'react';
// import data from '../data';
import axios from 'axios';

export default class AddBirthday extends Component {
    constructor(props){
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeGender = this.onChangeGender.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
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
    }
    // callAPI(){
    //     fetch("http://localhost:9000/testAPI")
    //         .then(res => res.text())
    //         .then(res => this.setState({apiResponse: res}));
    // }
    // componentWillMount(){
    //     this.callAPI();
    // }
    onChangeName(e){
        this.setState({
            name: e.target.value
        });
    }
    onChangeGender(e){
        this.setState({
            gender: e.target.value
        });
        console.log(e.target.value);
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
    // onChangeImage(e){
    //     let imgFormObj = new FormData();

    //     imgFormObj.append("imageName", "multer-image-"+Date.now());
    //     imgFormObj.append("imageData", e.target.files[0]);
    //     // imgFormObj.append("imageData", e.target.files[0]);

    //     this.setState({
    //         image: URL.createObjectURL(e.target.files[0])
    //     });
    //     console.log(e.target.files[0]);
    //     console.log(imgFormObj);
        
    //     axios.post('http://localhost:4000/days/uploadmulter', imgFormObj)
    //         .then(data => {
    //             if(data.data.success){
    //                 alert("Image Added");
    //             }
    //         }).catch(err => console.log(err))
    // }
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
        //     isBirthday: this.state.isBirthday,
        //     image: this.state.image
        // }
        console.log(birthdays);

        axios.post('http://localhost:4000/days/add', birthdays)
            .then(res => console.log(res.data));
        // window.location = '/';
        this.setState({
            name: '',
            isBirthday: '',
            date: ''
        });
    }

    render() {
        return (
            <div className="main-container">
                <form onSubmit={this.onSubmit} className="container">
                    <h3>Enter Details</h3>
                    <button onClick={() => {window.location = '/'}} id="back-btn">Back</button>
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
                        <label>Date:</label>
                        <input type="date"
                        required
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
                        <input type='submit' value="Add Birthday" className="btn btn-primary"/>
                        {/* <input type='submit' value="Upload" className="btn btn-primary"/> */}
                        {/* <input type='image' value={this.state.image} alt={this.state.name} /> */}
                    </div>
                </form>
            </div>
        );
    }
}