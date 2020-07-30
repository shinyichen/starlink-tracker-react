import React from "react";
import { InputNumber, Slider, Button } from "antd";

class SatSetting extends React.Component {

  state = {
    observerLat: 0,
    observerLon: 0,
    observerElevation: 0,
    satAltitude: 90,
    duration: [0, 90],
    isLoading: false
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
    this.setState({
      observerElevation: value
    });
  }

  handleChangeAltitude = (value) => {
    this.setState({
      satAltitude: Number(90 - +value)
    });
  }

  handleChangeDuration = (value) => {
    this.setState({
      duration: value
    })
  }

  showSatellite = () => {
    this.props.showNearbySatellites(this.state);
  }
  
  /************** render **************/

  render() {
    const durationMarkers = { 0: "0", 90: "90"};
    const {observerLat, observerLon, observerElevation, satAltitude, duration} = this.state;
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
                defaultValue={observerLon}
                style={{margin: "0 2px"}}
                onChange={this.handleChangeLon} />
            </div>

            {/* latitude */}
            <div className="list-item right-item">
              <label>Latitude: </label>
              <InputNumber
                min={-90}
                max={90}
                defaultValue={observerLat}
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
                defaultValue={observerElevation}
                style={{margin: "0 2px"}}
                onChange={this.handleChangeElevation} />
            </div>
          </div>
        </div>

        {/* altitude setting */}
        <div className="altitude-setting">
          <p className="setting-label">Restrictions</p>
          <div>
            <span>Show only satellites which are higher than <br /> altitude </span>
            <InputNumber
              min={0}
              max={90}
              defaultValue={satAltitude}
              style={{margin: "8px 2px 0"}}
              onChange={this.handleChangeAltitude} /><span> degrees.</span>
          </div>
        </div>

        {/* duration setting */}
        <div className="duration-setting">
          <p className="setting-label">Duration</p>
          <Slider className="duration-slider"
            range
            step={1}
            defaultValue={duration}
            min={0}
            max={90}
            marks={durationMarkers}
            onChange={this.handleChangeDuration} />
        </div>

        {/* button */}
        <div className="show-nearby">
          <Button
            className="show-nearby-btn"
            size="large"
            onClick={this.showSatellite}>Find Nearby Satellites</Button>
        </div>
      </div>
    );
  }
}

export default SatSetting;