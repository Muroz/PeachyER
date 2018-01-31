import React from "react";
import moment from "moment";
import { Image, Row, Col, Well, Button } from "react-bootstrap";

class timeColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }

  setTimes() {
    var content;
    for (var i = 2; i <= 23; i++) {
      content = [
        content,
        <div className="clientProfile_cell" key={i}>
          {" "}
          {i + ":00"}
        </div>
      ];
    }
    return content;
  }
  render() {
    return (
      <div className="timeColumn_container">
        <div className="timeColum_item">1</div>
        <div className="timeColum_item">2</div>
        <div className="timeColum_item">3</div>
        <div className="timeColum_item">4</div>
        <div className="timeColum_item">5</div>
        <div className="timeColum_item">6</div>
        <div className="timeColum_item">7</div>
        <div className="timeColum_item">8</div>
        <div className="timeColum_item">9</div>
        <div className="timeColum_item">10</div>
      </div>
    );
  }
}

export default timeColumn;
