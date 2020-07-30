import React from "react";
import { Button, Spin, List, Checkbox, Avatar } from "antd";
import satellite from "../assets/images/satellite.svg";

class SatelliteList extends React.Component {

  state = {
    selected: [],
    isLoading: false
  }

  addOrRemoveSat = (sat, checked, list) => {
    // is sat in the selected list
    const found = list.some( entry => entry.satid === sat.satid);

    if (checked && !found) { // add
      list.push(sat);
    } else if (!checked && found) { // remove
      list = list.filter( entry => entry.satid !== sat.satid);
    }

    return list;
  }

  handleCheckedSat = (event) => {
    const { dataInfo, checked } = event.target;
    const { selected } = this.state;
    const list = this.addOrRemoveSat(dataInfo, checked, selected);
    this.setState({
      selected: list
    });
  }

  handleShowOnMap = () => {
    this.props.showOnMap(this.state.selected);
  }
  
  render() {
    const { satInfo, isLoading } = this.props;
    const satList = satInfo? satInfo.above : [];
    const { selected } = this.state;

    return (
      <div className="sat-list-box">
        <Button className="sat-list-btn"
          size="large"
          disabled={selected.length === 0}
          onClick={this.handleShowOnMap}>
            Track on the map
        </Button>
        <hr />
        {
          isLoading?
            <div className="spin-box">
              <Spin tip="Loading..." size="large" />
            </div>
            :
            <List
              className="sat-list"
              itemLayout="horizontal"
              size="small"
              dataSource={satList}
              renderItem={item => (
                <List.Item actions={[<Checkbox dataInfo={item} onChange={this.handleCheckedSat} />]}>
                  <List.Item.Meta 
                    avatar={<Avatar size={50} src={satellite} alt="sat image"/>}
                    title={<p>{item.satname}</p>}
                    description={`Launch Date: ${item.launchDate}`} />
                </List.Item>
              )} />
        }
      </div>
    )
  }
}

export default SatelliteList;