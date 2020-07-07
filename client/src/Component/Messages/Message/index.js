import React from "react";
import ReactEmoji from "react-emoji";
import "./style.scss";
const Message = ({ message: { text, user }, name }) => {
  let isSentByCurrentUser = false;
  const trimmedName = name.trim().toLowerCase();
  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }
  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd right">
      <div className="messageBox alert alert-primary text-info messageText">
        <span className="font-weight-bold">{trimmedName} :</span>{" "}
        {ReactEmoji.emojify(text)}
        <br />
        <small className="text-muted">
          {new Date().toLocaleTimeString()} {new Date().toLocaleDateString()}
        </small>
      </div>
    </div>
  ) : (
    <div className="messageContainer pb-2 justifyStart left">
      {user === "Admin" ? (
        <div className="messageBox alert alert-secondary text-danger messageText">
          <span className="font-weight-bold">{user} :</span>{" "}
          {ReactEmoji.emojify(text)}
          <br />
          <small className="text-muted">
            {new Date().toLocaleTimeString()} {new Date().toLocaleDateString()}
          </small>
        </div>
      ) : (
        <div className="messageBox alert alert-secondary text-success messageText">
          <span className="font-weight-bold">{user} :</span>
          {ReactEmoji.emojify(text)}
          <br />
          <small className="text-muted">
            {new Date().toLocaleTimeString()} {new Date().toLocaleDateString()}
          </small>
        </div>
      )}
    </div>
  );
};

export default Message;
