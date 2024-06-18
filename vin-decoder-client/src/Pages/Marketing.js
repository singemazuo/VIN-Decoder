import React, { useState } from "react";
import axios from "axios";
import NavigationBar from "../Navigation/NavigationBar";
import Sidebar from "../Navigation/Sidebar";
import styles from "./Marketing.module.css";
import { useLocation } from "react-router-dom";

const Marketing = () => {
  const location = useLocation();
  const initialPhoneNumbers = location.state?.phoneNumbers || [];
  const [message, setMessage] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState(initialPhoneNumbers);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSendSMS = async () => {
    try {
      const promises = phoneNumbers.map((number) =>
        axios.post("http://localhost:5000/send-sms", {
          to: number,
          message: message,
        })
      );
      await Promise.all(promises);
      alert("Messages sent successfully");
    } catch (error) {
      console.error("Error sending SMS:", error);
      alert("Failed to send messages");
    }
  };

  const handleAddNumber = () => {
    if (phoneNumber && !phoneNumbers.includes(phoneNumber)) {
      setPhoneNumbers([...phoneNumbers, phoneNumber]);
      setPhoneNumber("");
    }
  };

  const handleRemoveNumber = (numberToRemove) => {
    setPhoneNumbers(phoneNumbers.filter((number) => number !== numberToRemove));
  };

  return (
    <>
      <div className={styles.sideBar}>
        <Sidebar />
      </div>
      <div className={styles.navBar}>
        <NavigationBar />
      </div>
      <div className={styles.marketingContainer}>
        <div className={styles.smsWrapper}>
          <img
            className={styles.marketingIcons}
            src="./icons/smartphone.svg"
            alt="phone"
          ></img>
          <div className={styles.sendSmsContainer}>
            <h2>Send SMS</h2>
            <textarea
              className={styles.textarea}
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className={styles.phoneNumberInput}>
              <input
                type="text"
                placeholder="Add phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <button onClick={handleAddNumber}>Add</button>
            </div>
            <div className={styles.phoneNumbersList}>
              {phoneNumbers.map((number, index) => (
                <div key={index} className={styles.phoneNumberItem}>
                  {number}
                  <button
                    className={styles.closeButton}
                    onClick={() => handleRemoveNumber(number)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <button onClick={handleSendSMS} className={styles.sendButton}>
              Send SMS
            </button>
            <button onClick={() => setPhoneNumbers([])} className={styles.sendButton}>
              Clear
            </button>
          </div>
        </div>
        <div className={styles.emailWrapper}>
          <img
            className={styles.marketingIcons}
            src="./icons/email.svg"
            alt="email"
          ></img>
          <div className={styles.sendEmailContainer}>
            <h2>Send Email</h2>
            <textarea
              className={styles.textarea}
              placeholder="Enter your message"
            />
            <div className={styles.phoneNumberInput}>
              <input
                type="text"
                placeholder="Add email"
              />
              <button>Add</button>
            </div>
            <div className={styles.phoneNumbersList}></div>
            <button className={styles.sendButton}>Send Email</button>
            <button className={styles.sendButton}>Clear</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Marketing;
