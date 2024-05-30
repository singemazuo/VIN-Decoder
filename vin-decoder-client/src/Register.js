import React, { useState } from "react";
import axios from "axios";
import styles from "./Register.module.css";
import NavigationBar from "./NavigationBar";


const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/register", {
        email,
        password,
        firstName,
        lastName
      });
      // Redirect to login page or show success message
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <>
      <NavigationBar />
      <div className={styles.registerContainer}>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
         <label className={styles.label}>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.registerInputBox}
          />
          <label className={styles.label}>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={styles.registerInputBox}
          />
          <label className={styles.label}>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={styles.registerInputBox}
          />
          <label className={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.registerInputBox}
          />
          <div className={styles.registerButtons}>
            <button className={styles.button}>Clear</button>
            <button className={styles.button}>Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
