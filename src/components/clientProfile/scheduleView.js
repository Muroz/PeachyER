import React from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import moment from 'moment';
import TimeColumn from './timeColumn';


class ScheduleView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: [],

    }
  }

  setTimes(){
  }
  render() {
        return (
      <div className='clientProfile_scheduleView'>
        <TimeColumn />
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(ScheduleView)