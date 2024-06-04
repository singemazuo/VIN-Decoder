import React from "react";
import NavigationBar from "../Navigation/NavigationBar";
import Sidebar from "../Navigation/Sidebar";
import { useAuth } from "./AuthContext";
import styles from "./Account.module.css";

const Account = () => {
  const { firstName } = useAuth();
  console.log("First name in Account component:", firstName);
  return (
    <>
      <div className={styles.sideBar}>
        <Sidebar />
      </div>
      <div className={styles.navBar}>
        <NavigationBar />
      </div>
      <div className={styles.container}>
        <h1>Welcome, {firstName}</h1>
      </div>
    </>
  );
};

export default Account;
