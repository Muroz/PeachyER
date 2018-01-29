"use strict"
import React from 'react';
import {Image, Row, Col, Well, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AddButton from './addButton';

class NavBar extends React.Component{

    constructor() {
    super();
    this.state = {
      showPopup: false
    };
  }
  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
render(){
    return(
            <ul className="navbar_ul">
                <li className="navbar_li"> <img src="/images/peachy_logo.png" className='logo' /> </li>
                <li className="navbar_li"><a href="/dashboard">Home</a></li>
                <li className="navbar_li"><a href="/client">Clients</a></li>
                <li className="navbar_li"><a href="/staff">Staff</a></li>
                <li className="navbar_li"> <a onClick={this.togglePopup.bind(this)}>Add person</a> </li>
                <li className='navbar_profile'> 
                    <img src="/images/profile_pic.jpg" className='profile_pic' />
                    <div className='profile_content'>
                    <h6 className='profile_name'> Diego Zuluaga </h6>
                    <a> <h6 className='log_out'> Log out </h6> </a>
                    </div>
                </li>

                 {this.state.showPopup ? 
                    <AddButton
                        closePopup={this.togglePopup.bind(this)}
                    />
                    : null
                }

            </ul>

            
    )
  }
}

function mapStateToProps(state){
    return {
    }
}

export default connect(mapStateToProps)(NavBar);

