import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { capitalize, DisplayMessage, LogOutButton } from '../utils/functions_for_components';

export default class Register extends Component {
    constructor(props){
        super(props);
        
        this.isLoggedIn = localStorage.getItem('isLoggedIn');
        this.email = localStorage.getItem('email');

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword1 = this.onChangePassword1.bind(this);
        this.onChangePassword2 = this.onChangePassword2.bind(this);
        this.onChangeToken = this.onChangeToken.bind(this);
        this.onClickLogout = this.onClickLogout.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            nameValidation:{
                className: '',
                validateMessage: ''
            },
            emailValidation:{
                className: '',
                validateMessage: ''
            },
            pass1Validation:{
                className: '',
                validateMessage: ''
            },
            pass2Validation:{
                className: '',
                validateMessage: ''
            },
            tokenValidation:{
                className: '',
                validateMessage: ''
            },
            name: "",
            email: '',
            password: '',
            password2: '',
            token: '',
            className: '',
            message: '',
        };
    }
    componentDidUpdate(){
        if(this.state.className !== ''){
            window.location.href = '/';
            setTimeout(() => {
                this.setState({
                    className: '',
                    message: ''
                })
            }, 2000);
        }
    }
    loading(){
        this.setState({
            className: 'displayMessage',
            message: 'Loading..'
        })
    }
    onClickLogout(){
        this.loading();
        axios.post('http://localhost:4000/user/logout', {email: localStorage.getItem('email')})
        .then(res => {
            this.setState({
                className: 'displayMessage',
                message: res.data.message
            })
            setTimeout(() => {
                if(!(res.data.isLoggedIn)){
                    localStorage.clear();
                    this.props.history.push({
                        pathname: '/user/login',
                    })
                }
            }, 1000);
        })
        .catch(err => console.log(err));
    }
    onChangeName(e){
        if(e.target.value.length===0){
            this.setState({
                nameValidation:{
                    className: '',
                    validateMessage: ''
                }
            })
        } else if(e.target.value.length<3){
            this.setState({
                nameValidation:{
                    className: 'errorMessage',
                    validateMessage: 'Should be more than 3 Characters.'
                }
            })
        } else {
            this.setState({
                nameValidation:{
                    className: '',
                    validateMessage: ''
                }
            })
        }
        this.setState({
            name: e.target.value
        });
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
    onChangePassword1(e){
        if(e.target.value.length===0){
            this.setState({
                pass1Validation: {
                    className: '',
                    validateMessage: ''
                }
            })
        } else if(e.target.value.length<6){
            this.setState({
                pass1Validation: {
                    className: 'errorMessage',
                    validateMessage: 'Must be at least 6 characters long'
                }
            })
        } else {
            this.setState({
                pass1Validation: {
                    className: '',
                    validateMessage: ''
                }
            })
        }
        this.setState({
            password: e.target.value
        });
    }
    onChangePassword2(e){
        if(e.target.value.length===0){
            this.setState({
                pass2Validation: {
                    className: '',
                    validateMessage: ''
                }
            })
        } else if(e.target.value !== this.state.password){
            this.setState({
                pass2Validation: {
                    className: 'errorMessage',
                    validateMessage: 'Not a match'
                }
            })
        } else {
            this.setState({
                pass2Validation: {
                    className: '',
                    validateMessage: ''
                }
            })
        }
        this.setState({
            password2: e.target.value
        });
    }
    onChangeToken(e){
        this.setState({
            token: e.target.value 
        });
    }
    onSubmit(e){
        console.log(e.target);
        e.preventDefault();
        let isSuccess = false;
        const user = {
            name: capitalize(this.state.name),
            email: this.state.email,
            password: this.state.password,
            token: this.state.token
        };
        if(
            this.state.nameValidation.className === '' &&
            this.state.emailValidation.className === '' &&
            this.state.pass1Validation.className === '' &&
            this.state.pass2Validation.className === ''
            ){
                // NoOneShouldGuess!@&*
                axios.post('http://localhost:4000/user/register', user)
                    .then(res => {
                        this.setState({
                            className: 'displayMessage',
                            message: res.data.message
                        });
                        isSuccess = res.data.isLoggedIn;
                    })
                    .catch(err => {
                        this.setState({
                            className: 'displayMessage',
                            message: err
                        });
                    });
            } else {
                this.setState({
                    className: 'displayMessage',
                    message: 'Please Fill valid Details'
                })
            }
        setTimeout(() => {
            if(isSuccess){
                this.props.history.push({
                    pathname: '/',
                })
            }
        }, 2000);
    }
    render() {
        let displayContent;
        if(!(this.isLoggedIn)){
            displayContent = (
                <div className="container">
                    <h3>Register</h3>
                    <button onClick={() => {window.location.href = '/'}} id="backBtn">Back</button>
                    <button onClick={() => {window.location.href = '/user/login'}} id='loginBtn'>Login Here</button>
                    <form onSubmit={this.onSubmit}>

                        <div className="form-group">
                            <label>Name: </label>
                            <input type="text"
                            required
                            placeholder="Enter Name"
                            className="input"
                            value={this.state.name}
                            onChange={this.onChangeName}/>
                            <span className={this.state.nameValidation.className}>{this.state.nameValidation.validateMessage}</span>
                        </div>

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
                            onChange={this.onChangePassword1}/>
                            <span className={this.state.pass1Validation.className}>{this.state.pass1Validation.validateMessage}</span>
                        </div>

                        <div className="form-group">
                            <label>Confirm: </label>
                            <input type="password"
                            required
                            placeholder="Confirm Password"
                            className="input"
                            value={this.state.password2}
                            onChange={this.onChangePassword2}/>
                            <span className={this.state.pass2Validation.className}>{this.state.pass2Validation.validateMessage}</span>
                        </div>

                        <div className="form-group">
                            <label>Register Token: </label>
                            <input type="password"
                            placeholder="Enter Token"
                            className="input"
                            value={this.state.token}
                            onChange={this.onChangeToken}/>
                            <span className={this.state.tokenValidation.className}>{this.state.tokenValidation.validateMessage}</span>
                        </div>

                        <div className="form-group">
                            <input type='submit' value="Register"/>
                        </div>

                    </form>
                </div>
            );
        } else {
            displayContent = (
                <div className='container'>
                    Already registered and logged in with {this.email}
                    <LogOutButton onClick={this.onClickLogout}/>
                    <Link to='/'>
                        <button id='backBtn'>Back</button>
                    </Link>
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