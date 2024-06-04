import React, { useState } from "react";
import axios from "axios";
import styles from "./Register.module.css";
import Sidebar from "../Navigation/Sidebar";
import NavigationBar from "../Navigation/NavigationBar";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/register", {
        email,
        password,
        firstName,
        lastName,
      });
      navigate('/login');
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <>
      <div className={styles.sideBar}>
        <Sidebar />
      </div>
      <div className={styles.navBar}>
        <NavigationBar />
      </div>
      <div className={styles.registerContainer}>
        <h1>Register</h1>
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <label className={styles.label}>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.registerInputBox}
            required
          />
          <label className={styles.label}>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={styles.registerInputBox}
            required
          />
          <label className={styles.label}>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={styles.registerInputBox}
            required
          />
          <label className={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.registerInputBox}
            required
          />
          <div className={styles.registerButtons}>
            <button
              type="button"
              className={styles.button}
              onClick={() => {
                setEmail("");
                setFirstName("");
                setLastName("");
                setPassword("");
              }}
            >
              Clear
            </button>
            <button type="submit" className={styles.button}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
