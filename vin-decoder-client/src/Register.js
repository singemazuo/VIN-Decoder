import React from 'react';
import styles from './Register.module.css';
import NavigationBar from './NavigationBar';


const Register = () => {

    return (
      <>
      <NavigationBar />

      <div className={styles.registerContainer}>
        <h1>Register</h1>
        <form>
          <label>Email</label>
          <input type="text"></input>
          <label>Password</label>
          <input type="password"></input>
          <div className={styles.registerButtons}>
            <button>Clear</button>
            <button>Submit</button>
          </div>
        </form>
      </div>
      </>
      
    );
};

export default Register;