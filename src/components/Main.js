import React from "react";
import SatSetting from "./SatSetting";
import SatList from "./SatelliteList";
import WordMap from "./WorldMap";
import axios from "axios";
import {NEARBY_SATELLITE, SAT_API_KEY, STARLINK_CATEGORY} from "../constants";

class Main extends React.Component {

  state = {
    satInfo: null,
    settings: null,
    isLoadingList: false
  }

  showNearbySatellites = (settings) => {
    this.setState({
      settings: settings
    });
    this.fetchSatellite(settings);
  }

  fetchSatellite = (settings) => {
    const {observerLat, observerLon, observerElevation, satAltitude, duration} = settings;
    const url = `${NEARBY_SATELLITE}/${observerLat}/${observerLon}/${observerElevation}/${satAltitude}/}
                 ${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;

    this.setState({
      isLoadingList: true
    });

    axios.get(url).then( res => {
      this.setState({
        satInfo: res.data,
        isLoadingList: false
      });
    }).catch( err => {
      console.log("Error fetching satellite: ", err);
      this.setState({
        isLoadingList: false
      });
    });
  }

  showOnMap = (selectedSats) => {
    console.log(selectedSats);
  }

  render() {
    const {satInfo} = this.state;

    return (
      <div className="main">
        <div className="left-side">
          <SatSetting showNearbySatellites={this.showNearbySatellites}/>
          <SatList satInfo={satInfo} isLoading={this.state.isLoadingList} showOnMap={this.showOnMap}/>
        </div>
        <div className="right-side">
          <WordMap />
        </div>
      </div>
    );
  }
}

export default Main