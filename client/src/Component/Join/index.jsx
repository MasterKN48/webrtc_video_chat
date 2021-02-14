import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/video-call.png";
const Join = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  return (
    <div className="m-4">
      <section className="min-vh-100 d-flex bg-primary align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 justify-content-center">
              <div className="card bg-primary shadow-soft border-light p-4 mb-4">
                <div className="row no-gutters">
                  <div className="col-md-5">
                    <div className="profile-image bg-primary shadow-inset border border-light rounded-circle p-3 ml-3 mt-n5">
                      <img
                        lazy="loading"
                        src={Logo}
                        className="card-img-top rounded-circle border-light shadow-soft"
                        alt="Avatar"
                      />
                    </div>
                  </div>
                  <div className="col-md-7 ">
                    <h4 className="mt-4">Video Chat</h4>
                  </div>
                </div>
              </div>
              <div className="card bg-primary shadow-soft border-light p-4">
                <div className="card-header text-center pb-0">
                  <h4 className="h4">
                    <i className="las la-igloo"></i> Join Room
                  </h4>
                </div>
                <div className="card-body">
                  <form className="mt-4">
                    <div className="form-group">
                      <label htmlFor="name">User Name</label>
                      <div className="input-group mb-4">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <span className="las la-signature la-lg"></span>
                          </span>
                        </div>
                        <input
                          className="form-control"
                          placeholder="Enter Name"
                          required
                          id="name"
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                          type="text"
                          aria-label="User Name"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="form-group">
                        <label htmlFor="room">Room</label>
                        <div className="input-group mb-4">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="las la-home la-lg"></i>
                            </span>
                          </div>
                          <input
                            className="form-control"
                            required
                            onChange={(e) => setRoom(e.target.value)}
                            value={room}
                            type="text"
                            placeholder="Enter Room Name"
                            id="room"
                          />
                        </div>
                      </div>
                    </div>
                    <Link
                      onClick={(e) =>
                        !name || !room ? e.preventDefault() : null
                      }
                      to={{ pathname: "/chat", state: { name, room } }}
                    >
                      <button
                        type="submit"
                        className="btn btn-block btn-primary"
                      >
                        <i className="las la-sign-in-alt la-lg"></i> Sign in
                      </button>
                    </Link>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container-fluid mt-4 p-4 shadow-inset bg-grey">
        <footer className="justify-content-center  text-center">
          <span className="text-warning font-weight-bold">
            Under Development
          </span>
          <br />
          <a
            rel="noreferrer noopener"
            href="https://www.webfx.com/tools/emoji-cheat-sheet/"
            className="text-dark font-weight-bold"
          >
            Emoji Cheatsheet
            <span className="ml-1">
              <i className="las la-smile-wink la-lg"></i>
            </span>
          </a>
          <br />
          <a
            rel="noreferrer noopener"
            className="text-info font-weight-bold"
            href="https://github.com/masterkn48"
          >
            Created By MasterKN <i className="lab la-github-alt la-lg"></i>
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Join;
