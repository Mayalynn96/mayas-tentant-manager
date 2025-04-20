import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import API from './utils/API';
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import './App.css';
import SignUp from "./pages/SignUp/SignUp";
import PropertyId from "./pages/PropertyId/PropertyId";
import UnitTenants from "./pages/UnitTenants/UnitTenants";
import Bills from './pages/Bills/Bills';
import ExpenseSatement from './pages/ExpenseStatement/ExpenseStatement'

function App() {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isLoggedIn: false,
    userData: null,
    token: null,
    error: null
  })

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      API.isValidToken(savedToken).then(tokenData => {
        if (tokenData.isValid) {
          setAuthState({
            isLoading: false,
            isLoggedIn: true,
            userData: tokenData.user,
            token: savedToken,
            error: null
          })
        } else {
          localStorage.removeItem("token")
          setAuthState({
            isLoading: false,
            isLoggedIn: false,
            userData: null,
            token: null,
            error: "Invalid Token"
          })
        }
      })
    } else {
      setAuthState({
        isLoading: false,
        isLoggedIn: false,
        userData: null,
        token: null,
        error: "No Token"
      })
    }
  }, []);

  return (
    <Router>
      <Routes>
      <Route index element={<Home authState={authState} />} />
      <Route path="home" element={<Home authState={authState} />} />
      <Route path="login" element={<Login setAuthState={setAuthState} />} />
      <Route path="signUp" element={<SignUp setAuthState={setAuthState} />} />
      <Route path="property/:propertyId" element={<PropertyId authState={authState} />} />
      <Route path="property/:propertyId/unit/:unitId" element={<UnitTenants authState={authState} />} />
      <Route path="property/:propertyId/bills" element={<Bills authState={authState}/>}/>
      <Route path="property/:propertyId/expense-statement" element={<ExpenseSatement authState={authState}/>}/>
      </Routes>
    </Router>
  );
}

export default App;
