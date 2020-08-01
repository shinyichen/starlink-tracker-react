import React from "react";
import { feature } from "topojson-client";
import axios from "axios";
import { geoKavrayskiy7 } from "d3-geo-projection";
import { geoGraticule, geoPath } from "d3-geo";
import { select as d3Select } from "d3-selection";
import * as d3Scale from "d3-scale"; // scaling
import { schemeCategory10  } from "d3-scale-chromatic"; // colors
import { timeFormat as d3TimeFormat } from 'd3-time-format'; // time format
import { Spin } from "antd";
import { WORLD_MAP_URL, SATELLITE_POSITION_URL, SAT_API_KEY } from "../constants";

const width = 960;
const height = 600;

class WordMap extends React.Component {

  state = {
    map: null,
    color: d3Scale.scaleOrdinal(schemeCategory10),
    isLoading: false
  }

  constructor() {
    super();
    this.mapCanvasRef = React.createRef();
    this.trackCanvasRef = React.createRef();
  }

  componentDidMount() {
    axios.get(WORLD_MAP_URL).then( res => {
      const { data } = res;
      const land = feature(data, data.objects.countries).features;
      this.generateMap(land);
    }).catch( e => {
      console.log("error fetching map data, ", e);
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.selectedSats !== this.props.selectedSats) {
      const { observerLat, observerLon, duration } = this.props.settings;
      const startTime = duration[0] * 60; // speed up 60x
      const endTime = duration[1] * 60;

      // fetch urls for each sat (list or promises)
      const urls = this.props.selectedSats.map( sat => {
        const { satid } = sat;
        const url = `${SATELLITE_POSITION_URL}/${satid}/${observerLat}/${observerLon}/${startTime}/${endTime}/&apiKey=${SAT_API_KEY}`;
        return axios.get(url);
      });

      this.setState({
        isLoading: true
      });

      // handle promises
      axios.all(urls).then(
        axios.spread( (...responses) => {
          return responses.map( res => res.data );
        })
      ).then (data => {
        if (data.length > 0)
          this.track(data);
        else 
          throw new Error("No satellite position info");

        this.setState({
          isLoading: false
        });
      }).catch( err => {
        this.setState({
          isLoading: false
        });
        console.log("Error fetching satellite positions");
        alert("Error fetching satellite positions" + err);
      })
    }
  }

  track = (data) => {
    const { duration } = this.props.settings;
    const len = data[0].positions.length;
    const { trackContext } = this.state.map;
    let start = new Date();

    let t = 0;

    // update track map every second
    let timer = setInterval( () => {
      let timePassed = Date.now() - start;

      if (t === 0)
        start.setSeconds(start.getSeconds() + duration[0] * 60);

      let now = new Date(start.getTime() + 60 * timePassed);
      trackContext.clearRect(0, 0, width, height);
      trackContext.font = "bold 14px sans-serif";
      trackContext.fillStyle = "#333";
      trackContext.textAlign = "center";
      trackContext.fillText(d3TimeFormat(now), width / 2, 10);

      if (t >= len) {
        clearInterval(timer);
        return;
      }

      // draw sat
      data.forEach( sat => {
        const { info, positions } = sat;
        this.drawSat(info, positions[t]);
      });

      t += 60;

    }, 1000);
  }

  drawSat(sat, pos){
    const name = sat.satname;
    const { projection, trackContext } = this.state.map;
    const xy = projection([pos.satlongitude, pos.satlatitude]);

    trackContext.fillStyle = this.state.color(name);
    trackContext.beginPath();
    trackContext.arc(xy[0],xy[1],4,0,2*Math.PI);
    trackContext.fill();

    trackContext.font = "bold 11px sans-serif";
    trackContext.textAlign = "center";
    trackContext.fillText(name, xy[0], xy[1]+14);
}

  generateMap = (land) => {
    const projection = geoKavrayskiy7().scale(170).translate([width / 2, height / 2]).precision(.1);
    const graticule = geoGraticule(); // lat lon
    const mapCanvas = d3Select(this.mapCanvasRef.current).attr("width", width).attr("height", height);
    const mapContext = mapCanvas.node().getContext("2d");
    const trackCanvas = d3Select(this.trackCanvasRef.current).attr("width", width).attr("height", height);
    const trackContext = trackCanvas.node().getContext("2d");
    let path = geoPath().projection(projection).context(mapContext);

    // draw graticule
    mapContext.strokeStyle = "#000";
    mapContext.globalAlpha = 0.7;
    mapContext.beginPath();
    path(graticule());
    mapContext.lineWidth = 0.1;
    mapContext.stroke();

    // draw graticule outline
    mapContext.beginPath();
    mapContext.lineWidth = 0.5;
    path(graticule.outline());
    mapContext.stroke();

    // draw land
    land.forEach(ele => {
      mapContext.fillStyle = '#B3DDEF';
      mapContext.strokeStyle = '#000';
      mapContext.globalAlpha = 0.7;
      mapContext.beginPath();
      path(ele);
      mapContext.fill();
      mapContext.stroke();
    });

    this.setState({
      map: {
        projection: projection,
        graticule: graticule,
        mapContext: mapContext,
        trackContext: trackContext
      }
    });
  }

  render() { 
    const { settings, selectedSats } = this.props;
    const { isLoading } = this.state;

    return (
      <div className="map-box">
        {isLoading? 
          <div className="spinner">
            <Spin tip="Loading..." size="large" />
          </div>
          :
          null
        }
        <canvas className="map" ref={this.mapCanvasRef} />
        <canvas className="track" ref={this.trackCanvasRef} />
      </div>
    );
  }
}
 
export default WordMap;