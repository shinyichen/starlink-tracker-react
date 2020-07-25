import React from "react";
import starlinkLogo from "../assets/images/starlink_logo.svg";

class Header extends React.Component {

  render() {
    return (
      <header className="app-header">
        <img src={starlinkLogo} className="app-logo" alt="logo" />
        <p className="title">
          StarLink Tracker
        </p>
      </header>
    )
  }
}

export default Header;