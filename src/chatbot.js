import React, { useState } from 'react';
import axios from 'axios';
import "./chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");

  // Function to handle sending messages
  const sendMessage = async () => {
    if (!userMessage.trim()) return;  // Don't send empty messages
    
    // Add the user's message to the chat
    setMessages(prevMessages => [
      ...prevMessages,
      { text: userMessage, sender: 'user' }
    ]);
    setUserMessage("");  // Clear the input field

    try {
      // Make a request to the Express backend to get a response from the chatbot API
      const response = await axios.post('http://localhost:5000/get-prompt', {
        message: userMessage
      });
      console.log('Response from server:', response.data);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: response.data.message, sender: 'bot' }
      ]);
    } catch (error) {
        console.error('Error sending message:', error);
        if (error.response) {
          console.error('Response error data:', error.response.data);
          console.error('Response status:', error.response.status);
        } else if (error.request) {
          console.error('Request error data:', error.request);
        } else {
          console.error('General error:', error.message);
        }
      // In case of error, you can add a fallback response or alert
      setMessages(prevMessages => [
        ...prevMessages,
        { text: 'Sorry, something went wrong. Please try again.', sender: 'bot' }
      ]);
    }
  };

  return (
    <div className="chatbot-container">
      <h1 className="chatbot-title">
        Want to become a CS2 pro? Our chatbot will respond to your questions!
      </h1>
      <div className="chat-window">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Type your message here..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
