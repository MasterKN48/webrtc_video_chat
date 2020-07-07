import React from "react";
const Input = ({ msg, setMsg, sendMessage }) => {
  return (
    <div className="row">
      <div className="col-10">
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text text-warning">
              <i className="las la-smile la-lg"></i>
            </span>
          </div>
          <input
            className="form-control"
            id="message"
            type="text"
            value={msg}
            onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Enter Your Messages"
          />
        </div>
      </div>
      <div className="col-2">
        <button
          className="btn btn-block btn-primary text-success"
          onClick={(e) => sendMessage(e)}
        >
          <i className="las la-paper-plane la-lg"></i>
        </button>
      </div>
    </div>
  );
};

export default React.memo(Input);
