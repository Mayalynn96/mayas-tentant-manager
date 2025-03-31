import React, { useState } from 'react';
import API from "../../utils/API";
import { useNavigate } from "react-router-dom";
import './Login.css';

function Login({ setAuthState }) {
    // All state for login and sign up
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    // redirect to SingUp function
    const redirectTo = (destination) => {
        navigate(`/${destination}`);
    }

    // input handler for each state
    const handleInputChange = (e) => {
        if (e.target.id === "emailInput") {
            setEmailInput(e.target.value)
        } else if (e.target.id === "passwordInput") {
            setPasswordInput(e.target.value)
        } 
    }

    // Adding useNavigate to navigate to homepage
    const navigate = useNavigate();

    // handles login
    const handleLogin = (e) => {
        e.preventDefault();

        const userObj = {
            email: emailInput,
            password: passwordInput
        }

        API.login(userObj).then(data => {

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
            setAuthState({
                isLoading: false,
                isLoggedIn: false,
                userData: null,
                token: null,
                error: err
            })
            console.log(err)
        })
    }


    return (
        <main id="LoginMain">
            <div className="loginBody">
                <div id="loginCard">
                    <form className="loginForm" id="loginForm">
                        <input type="text" id="emailInput" placeholder="Email" value={emailInput} onChange={handleInputChange} autoComplete='email' />
                        <input type="password" id="passwordInput" placeholder="Password" value={passwordInput} onChange={handleInputChange} autoComplete='current-password' />
                        <button onClick={handleLogin}>Login</button>
                    </form>
                    <div id="signUpCard">
                        <p>No acount yet? Come join us!</p>
                        <button onClick={() => {redirectTo("signUp")}}>Go Sign up Now</button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login;