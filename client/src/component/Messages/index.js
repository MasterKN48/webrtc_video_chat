import React from "react";
import Message from "./Message";
import "./style.scss";

const Messages = ({ messages, name }) => {
  return (
    <div className="messages bg-primary shadow-inset rounded py-4">
      {messages.map((mes, i) => (
        <div key={i}>
          <Message message={mes} name={name} />
        </div>
      ))}
    </div>
  );
};

export default Messages;
