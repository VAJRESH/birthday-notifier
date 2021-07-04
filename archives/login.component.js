import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { DisplayMessage, LogOutButton } from '../front-end/src/utils/functions_for_components';

export default class Register extends Component {
    constructor(props){
        super(props);
        this.isLoggedIn = localStorage.getItem('isLoggedIn');

        this.onClickLogout = this.onClickLogout.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            emailValidation:{
                className: '',
                validateMessage: ''
            },
            passValidation:{
                className: '',
                validateMessage: ''
            },
            name: "",
            email: '',
            password: '',
            password2: '',
            className: '',
            message: ''
        };
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
        if(localStorage.getItem('isLoggedIn')){
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        }
    }
    onClickLogout(){
        axios.post('/user/logout', {email: localStorage.getItem('email')})
        .then(res => {
            this.setState({
                className: 'displayMessage',
                message: res.data.message
            })
            setTimeout(() => {
                if(!(res.data.isLoggedIn)){
                    localStorage.clear();
                    this.props.history.push({
                        pathname: '/',
                    })
                }
            }, 1000);
        })
        .catch(err => console.log(err));
    }
    onChangeEmail(e){
        if(e.target.value.length===0){
            this.setState({
                emailValidation: {
                    className: '',
                    validateMessage: ''
                }
            })
        } else if(!(e.target.value.includes('@'))){
            this.setState({
                emailValidation: {
                    className: 'errorMessage',
                    validateMessage: 'Email is invalid.'
                }
            })
        } else {
            this.setState({
                emailValidation: {
                    className: '',
                    validateMessage: ''
                }
            })
        }
        this.setState({
            email: e.target.value
        });
    }
    onChangePassword(e){
        if(e.target.value.length===0){
            this.setState({
                passValidation: {
                    className: '',
                    validateMessage: ''
                }
            })
        } else if(e.target.value.length<6){
            this.setState({
                passValidation: {
                    className: 'errorMessage',
                    validateMessage: 'Must be at least 6 characters long'
                }
            })
        } else {
            this.setState({
                passValidation: {
                    className: '',
                    validateMessage: ''
                }
            })
        }
        this.setState({
            password: e.target.value
        });
    }
    loading(){
        this.setState({
            className: 'displayMessage',
            message: 'Loading..'
        })
    }
    onSubmit(e){
        this.loading();
        e.preventDefault();
        const user = {
            email: this.state.email,
            password: this.state.password,
        };
        if(
            this.state.emailValidation.className === '' &&
            this.state.passValidation.className === ''
            ){
                // NoOneShouldGuess!@&*
                axios.post('/user/login', user)
                    .then(res => {
                        this.setState({
                            className: 'displayMessage',
                            message: res.data.message
                        })
                        if(res.data.isLoggedIn){
                            localStorage.setItem('email', user.email);
                            localStorage.setItem('isLoggedIn', res.data.isLoggedIn);
                            console.log(localStorage)
                        }
                    }).catch(err => {
                        this.setState({
                            className: 'displayMessage',
                            message: err
                        })
                    });
            } else {
                this.setState({
                    className: 'displayMessage',
                    message: 'Please Fill valid Details'
                })
            }
            
            this.setState({
                email: '',
                password: '',
            })
    }

    render() {
        let displayContent;
        if(this.isLoggedIn){
            displayContent = (
                <div className='container'>
                    <LogOutButton onClick={this.onClickLogout}/>
                    <Link to='/'>
                        <button id='backBtn'>Back</button>
                    </Link>
                </div>
            )
        } else {
            displayContent = (
                <div className='container'>
                    <h3>Login Page</h3>
                    <button onClick={() => {window.location.href = '/'}} id="backBtn">Back</button>
                    <button onClick={() => {window.location.href = '/user/register'}} id="registerBtn">Register Here</button>

                    <form onSubmit={this.onSubmit} >


                        <div className="form-group">
                            <label>Email: </label>
                            <input type="email"
                            required
                            placeholder="Enter Email"
                            className="input"
                            value={this.state.email}
                            onChange={this.onChangeEmail}/>
                            <span className={this.state.emailValidation.className}>{this.state.emailValidation.validateMessage}</span>
                        </div>

                        <div className="form-group">
                            <label>Password: </label>
                            <input type="password"
                            required
                            placeholder="Enter Password"
                            className="input"
                            value={this.state.password}
                            onChange={this.onChangePassword}/>
                            <span className={this.state.passValidation.className}>{this.state.passValidation.validateMessage}</span>
                        </div>

                        <div className="form-group">
                            <input type='submit' value="Login" className="btn btn-primary"/>
                        </div>

                    </form>
                </div>
            )
        }
        return (
            <div className="main-container">
                <DisplayMessage className={`hideMessage ${this.state.className}`} key={Date.now()+''} message={this.state.message}/>
                { displayContent }
            </div>
        );
    }
}