import React, { useRef, useEffect } from "react";
import ReactEmoji from "react-emoji";
import "./style.scss";
import { getDateAndTime } from "../../Date";

const Message = ({ message: { text, user }, name }) => {
  const myRef = useRef();
  useEffect(() => {
    myRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      // inline: "end",
    });
  }, []);
  let isSentByCurrentUser = false;
  const trimmedName = name.trim().toLowerCase();
  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }
  return isSentByCurrentUser ? (
    <div ref={myRef} className="messageContainer justifyEnd right">
      <div className="messageBox alert alert-primary text-info messageText">
        <span className="font-weight-bold">{trimmedName} :</span>{" "}
        {ReactEmoji.emojify(text)}
        <br />
        <small className="text-muted">{getDateAndTime(new Date())}</small>
      </div>
    </div>
  ) : (
    <div ref={myRef} className="messageContainer pb-2 justifyStart left">
      {user === "Admin" ? (
        <div className="messageBox alert alert-secondary text-danger messageText">
          <span className="font-weight-bold">{user} :</span>{" "}
          {ReactEmoji.emojify(text)}
          <br />
          <small className="text-muted">{getDateAndTime(new Date())}</small>
        </div>
      ) : (
        <div className="messageBox alert alert-secondary text-success messageText">
          <span className="font-weight-bold">{user} :</span>
          {ReactEmoji.emojify(text)}
          <br />
          <small className="text-muted">{getDateAndTime(new Date())}</small>
        </div>
      )}
    </div>
  );
};

export default Message;
