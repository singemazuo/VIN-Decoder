import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {

    return (
      <div className='container'>
        <h1>Register</h1>
        <form>
          <label>Email</label>
          <input type="text"></input>
          <label>Password</label>
          <input type="password"></input>

        </form>
      </div>
    );
};

export default Register;