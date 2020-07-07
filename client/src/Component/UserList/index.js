import React from "react";
import Profile from "../../assets/profile.png";
const UserList = ({ users, makeCall, user, connectedUser, disconnect }) => {
  return (
    <div>
      <div className="card bg-primary shadow-inset border-light">
        <h2 className="card-title mx-4 my-3 alert alert-secondary shadow-soft">
          <span className="font-weight-bold">
            <i className="las la-wifi la-lg"></i> User's Online
          </span>
        </h2>
        <div className="pb-2">
          {users.map(({ name, id }) => (
            <div key={id}>
              {user === id ? (
                <div className="card mx-4 my-2 bg-primary shadow-inset">
                  <div className="text-left lead">
                    <img
                      src={Profile}
                      className="card-img-top rounded"
                      alt="Wood Portrait"
                      style={{ height: "48px", width: "48px" }}
                    />{" "}
                    {name}
                  </div>
                </div>
              ) : (
                <span>
                  <div className="card mx-4 my-1 bg-primary shadow-inset">
                    <div className="row no-gutters">
                      <div className="col-6 text-left">
                        <div className="row no-gutters">
                          <div className="col-6">
                            <img
                              src={Profile}
                              className="card-img-top rounded"
                              alt="Wood Portrait"
                              style={{ height: "48px", width: "48px" }}
                            />
                          </div>
                          <div className="col-6 pl-1 pt-2 lead"> {name}</div>
                        </div>
                      </div>
                      <div className="col-6 text-right">
                        {connectedUser.includes(id) ? (
                          <button
                            id={id}
                            onClick={() => disconnect(id)}
                            className="btn btn-icon-only"
                          >
                            <i className="las la-video-slash la-lg text-danger"></i>
                          </button>
                        ) : (
                          <button
                            id={id}
                            onClick={() => makeCall(id, name)}
                            className="btn btn-icon-only "
                          >
                            <i className="las la-video la-lg text-secondary"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserList);
