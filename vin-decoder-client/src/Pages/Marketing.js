import React, { useState } from "react";
import axios from "axios";
import NavigationBar from "../Navigation/NavigationBar";
import Sidebar from "../Navigation/Sidebar";
import styles from "./Marketing.module.css";
import { useLocation } from "react-router-dom";

const Marketing = () => {
  // Get the initial phone numbers passed from the previous page through the state
  const location = useLocation();
  const initialPhoneNumbers = location.state?.phoneNumbers || [];

  const [message, setMessage] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState(initialPhoneNumbers);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddresses, setEmailAddresses] = useState([]);
  const [emailAddress, setEmailAddress] = useState("");

  // Function to send SMS to all phone numbers in the list
  const handleSendSMS = async () => {
    try {
      // Create a list of promises to send SMS to each phone number
      const promises = phoneNumbers.map((number) =>
        axios.post("http://localhost:5000/send-sms", {
          to: number,
          message: message,
        })
      );
      // Wait for all SMS to be sent
      await Promise.all(promises);
      alert("Messages sent successfully");
    } catch (error) {
      console.error("Error sending SMS:", error);
      alert("Failed to send messages");
    }
  };

  // Function to send emails to all email addresses in the list
  const handleSendEmail = async () => {
    try {
      const response = await axios.post("http://localhost:5000/send-email", {
        emails: emailAddresses,
        message: message,
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send emails");
    }
  };

  // Function to add an email address to the list
  const handleAddEmail = () => {
    if (emailAddress && !emailAddresses.includes(emailAddress)) {
      setEmailAddresses([...emailAddresses, emailAddress]);
      setEmailAddress("");
    }
  };

  // Function to remove an email address from the list
  const handleRemoveEmail = (emailToRemove) => {
    setEmailAddresses(emailAddresses.filter((email) => email !== emailToRemove));
  };

  // Function to add a phone number to the list
  const handleAddNumber = () => {
    if (phoneNumber && !phoneNumbers.includes(phoneNumber)) {
      setPhoneNumbers([...phoneNumbers, phoneNumber]);
      setPhoneNumber("");
    }
  };

  // Function to remove a phone number from the list
  const handleRemoveNumber = (numberToRemove) => {
    setPhoneNumbers(phoneNumbers.filter((number) => number !== numberToRemove));
  };

  return (
    <>
      {/* Sidebar component */}
      <div className={styles.sideBar}>
        <Sidebar />
      </div>
      {/* Navigation bar component */}
      <div className={styles.navBar}>
        <NavigationBar />
      </div>
      {/* Main container for the marketing page */}
      <div className={styles.marketingContainer}>
        {/* SMS sending section */}
        <div className={styles.smsWrapper}>
          <img
            className={styles.marketingIcons}
            src="./icons/smartphone.svg"
            alt="phone"
          />
          <div className={styles.sendSmsContainer}>
            <h2>Send</h2>
            {/* Textarea for SMS message input */}
            <textarea
              className={styles.textarea}
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {/* Input and button for adding phone numbers */}
            <div className={styles.phoneNumberInput}>
              <input
                type="text"
                placeholder="Add phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <button onClick={handleAddNumber}>Add</button>
            </div>
            {/* List of phone numbers with remove button */}
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
            {/* Buttons for sending SMS and clearing the list */}
            <div className={styles.marketingButtons}>
              <button onClick={handleSendSMS} className={styles.sendButton}>
                Send
              </button>
              <button
                onClick={() => setPhoneNumbers([])}
                className={styles.sendButton}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
        {/* Email sending section */}
        <div className={styles.emailWrapper}>
          <img
            className={styles.marketingIcons}
            src="./icons/email.svg"
            alt="email"
          />
          <div className={styles.sendEmailContainer}>
            <h2>Send Email</h2>
            {/* Textarea for email message input */}
            <textarea
              className={styles.textarea}
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {/* Input and button for adding email addresses */}
            <div className={styles.phoneNumberInput}>
              <input
                type="text"
                placeholder="Add email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
              <button onClick={handleAddEmail}>Add</button>
            </div>
            {/* List of email addresses with remove button */}
            <div className={styles.phoneNumbersList}>
              {emailAddresses.map((email, index) => (
                <div key={index} className={styles.phoneNumberItem}>
                  {email}
                  <button className={styles.closeButton} onClick={() => handleRemoveEmail(email)}>
                    &times;
                  </button>
                </div>
              ))}
            </div>
            {/* Buttons for sending email and clearing the list */}
            <div className={styles.marketingButtons}>
              <button onClick={handleSendEmail} className={styles.sendButton}>
                Send
              </button>
              <button onClick={() => setEmailAddresses([])} className={styles.sendButton}>
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
      <p className={styles.disclaimer}>*Only verified phone numbers can be messaged with twilio trial account*</p>
    </>
  );
};

export default Marketing;
