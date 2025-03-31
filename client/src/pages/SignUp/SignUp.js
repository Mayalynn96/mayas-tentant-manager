import React, { useState } from 'react';
import API from "../../utils/API";
import { useNavigate } from "react-router-dom";
import './SignUp.css';

function SignUp({ setAuthState }) {
    // All state for sign up
    const [emailInput, setEmailInput] = useState('');
    const [fullNameInput, setFullNameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [secondPasswordInput, setSecondPasswordInput] = useState('');

    // redirect to login function
    const redirectTo = (destination) => {
        navigate(`/${destination}`);
    }

    // input handler for each state
    const handleInputChange = (e) => {
        if (e.target.id === "emailInput") {
            setEmailInput(e.target.value)
        } else if (e.target.id === "fullNameInput") {
            setFullNameInput(e.target.value)
        }else if (e.target.id === "passwordInput") {
            setPasswordInput(e.target.value)
        } else if (e.target.id === "secondPasswordInput") {
            setSecondPasswordInput(e.target.value)
        }
    }

    // Adding useNavigate to navigate to homepage
    const navigate = useNavigate();

    //Handles Sign Up
    const handleSignup = (e) => {
        e.preventDefault();

        const userObj = {
            email: emailInput,
            fullName: fullNameInput,
            password: passwordInput,
            secondPassword: secondPasswordInput,
        }

        if (passwordInput !== secondPasswordInput){
            console.log("Passwords don't match")
            return
        }

        API.signup(userObj).then(data => {

            if (data.token) {
                setAuthState({
                    isLoading: false,
                    isLoggedIn: true,
                    userData: data.user,
                    token: data.token,
                    error: null
                })
                localStorage.setItem("token", data.token)
                setEmailInput("");
                setPasswordInput("")
                navigate("/");
            } else {
                console.log(data)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <main id="LoginMain">
            <div className="loginBody">
                <div id="loginCard">
                    <form className="loginForm" id="loginForm">
                        <input type="text" id="fullNameInput" placeholder="Full Name" value={fullNameInput} onChange={handleInputChange} autoComplete='full name' />
                        <input type="text" id="emailInput" placeholder="Email" value={emailInput} onChange={handleInputChange} autoComplete='email' />
                        <input type="password" id="passwordInput" placeholder="Password" value={passwordInput} onChange={handleInputChange} autoComplete='current-password' />
                        <input type="password" id="secondPasswordInput" placeholder="secondPassword" value={secondPasswordInput} onChange={handleInputChange} autoComplete='secondPassword' />
                        <button onClick={handleSignup}>Sign up</button>
                    </form>
                    <div id="signUpCard">
                        <p>Already have an account? Login now!</p>
                        <button onClick={() => {redirectTo("login")}}>Go to Login</button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default SignUp;