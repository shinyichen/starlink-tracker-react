import React from "react";
import SatSetting from "./SatSetting";

class Main extends React.Component {

  render() {
    return (
      <div className="main">
        <div className="left-side">
          <SatSetting />
        </div>
        <div className="right-size">
          right
        </div>
      </div>
    );
  }
}

export default Main