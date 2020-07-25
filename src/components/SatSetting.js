import React from "react";
import { InputNumber } from "antd";

class SatSetting extends React.Component {

  state = {
    observerLat: 0,
    observerLon: 0
  }

  /************** handlers **************/

  handleChangeLat = (value) => {
    this.setState({
      observerLat: value
    });
  }

  handleChangeLon = (value) => {
    this.setState({
      observerLon: value
    });
  }

  handleChangeElevation = (value) => {

  }
  
  /************** render **************/

  render() {
    return (
      <div className="sat-setting">
        {/* location setting */}
        <div className="loc-setting">
          <p className="setting-label">From Location</p>

          {/* row */}
          <div className="setting-list two-item-col">

            {/* longitude */}
            <div className="list-item">
              <label>Logitude: </label>
              <InputNumber
                min={-180}
                max={180}
                defaultValue={0}
                style={{margin: "0 2px"}}
                onChange={this.handleChangeLon} />
            </div>

            {/* latitude */}
            <div className="list-item right-item">
              <label>Latitude: </label>
              <InputNumber
                min={-90}
                max={90}
                defaultValue={0}
                style={{margin: "0 2px"}}
                onChange={this.handleChangeLat} />
            </div>
          </div>

          {/* row */}
          <div className="setting-list">
            <div className="list-item">
              <label>Elevation (meters): </label>
              <InputNumber
                min={-413}
                max={8850}
                defaultValue={0}
                style={{margin: "0 2px"}}
                onChange={this.handleChangeElevation} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SatSetting;