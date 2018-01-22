"use strict"
import React from 'react';
import {Image, Row, Col, Well, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ClientCell from './clientCell';


class ClientList extends React.Component{

     constructor(props){
        super(props);

        this.setClients=this.setClients.bind(this);
    }

    setClients(client, index){
        
        return(<ClientCell key={index} name={client.name}/>);

    }
    render(){
        return(
            <div className='clientList_container'>
                <ul>
                    {this.props.clients.map(this.setClients)}
                </ul>
            </div>
        )
    }
}

function mapStateToProps(state){
    console.log(state.clientReducers);
    return {
        clients:state.clientReducers.clients
    }
}

export default connect(mapStateToProps)(ClientList);

