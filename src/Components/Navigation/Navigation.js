import React from "react";
import "./Navigation.css";

const Navigation = ({ onRouteChange, isSignedIn }) => {
  if (isSignedIn) {
    return (
      <nav className="main-nav mr3">
        <p
          onClick={() => onRouteChange("signIn")}
          className="f3 link dim underline pointer"
        >
          Sign Out
        </p>
      </nav>
    );
  } else {
    return (
      <nav className=" main-nav mr3">
        <p style={{marginRight:'20px'}}
          onClick={() => onRouteChange("register")}
          className="f3 link dim underline pointer"
        >
          Register
        </p>
        <p
          onClick={() => onRouteChange("signIn")}
          className="f3 link dim underline pointer"
        >
          Sign In
        </p>
      </nav>
    );
  }
};

export default Navigation;
