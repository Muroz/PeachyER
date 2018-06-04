import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';

class directoryPagination extends React.Component {

    checkVar = (value) => {
        if(this.props.page + value < 0){
            return true
        } else if ((this.props.page+value)*this.props.itemsPerPage >= this.props.total){
            return true;
        } else {
            return false;
        }
    }

    changePage(value){
        this.props.changePage(value)
    }
    render(){
        return(
            <div className='paginationContainer'>
                <div className='subPaginationContainer'> 
                    <div className='paginationInfo'> {this.props.page * this.props.itemsPerPage}-{this.props.page * this.props.itemsPerPage + this.props.itemsPerPage} of {this.props.total}  </div>
                    <IconButton disabled={this.checkVar(-1)} onClick={this.changePage.bind(this,this.props.page-1)} >
                        <KeyboardArrowLeft />
                    </IconButton>
                    <IconButton disabled={this.checkVar(+1)} onClick={this.changePage.bind(this,this.props.page+1)}>
                        <KeyboardArrowRight />
                    </IconButton>
                </div>
            </div>
        )
    }
}

export default directoryPagination;