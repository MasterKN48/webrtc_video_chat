import React from "react";
import Message from "./Message";
import ScrollToBottom from "react-scroll-to-bottom";
import "./style.scss";
const Messages = ({ messages, name }) => {
  return (
    <ScrollToBottom
      mode="bottom"
      className="messages bg-primary shadow-inset rounded pt-4 pb-4"
    >
      {messages.map((mes, i) => (
        <div key={i}>
          <Message message={mes} name={name} />
        </div>
      ))}
    </ScrollToBottom>
  );
};

export default Messages;
