import React from "react";
import Messages from "../Messages";
import Input from "../Input";
import { Link } from "react-router-dom";
const ChatBox = ({ room, messages, name, msg, setMsg, sendMessage }) => {
  return (
    <div className="chatbox height2">
      <div className="card bg-primary shadow-inset">
        <div className="card-header py-4 px-3">
          <div className="row no-gutters px-2 py-2 alert-secondary shadow-soft rounded">
            <div className="col-4">
              <div className="text-left text-info lead">
                <i className="las la-home"></i> {room}
              </div>
            </div>
            <div className="col-4">
              <div className="text-center lead text-success">
                <i className="las la-comments la-lg"></i> Chats
              </div>
            </div>
            <div className="col-4">
              <div className="text-right text-danger lead">
                <Link to="/">
                  <i className="las la-sign-out-alt la-lg"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body py-4 px-3">
          <Messages messages={messages} name={name} />
          <br />
          <Input msg={msg} setMsg={setMsg} sendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
