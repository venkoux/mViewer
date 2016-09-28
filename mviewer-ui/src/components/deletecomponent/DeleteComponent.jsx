import React from 'react'
import deleteStyles from './delete.css'
import $ from 'jquery'
import Modal from 'react-modal'
import service from '../../gateway/service.js';

class DeleteComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      message:'',
      successMessage: false
    }
  }

  closeModal() {
    this.props.closeModal(this.state.successMessage);
  }

  clickHandlerYes(){
    var that = this;
    var type = this.props.title;
    var obj={};
    var deleteUrl ='';
    if(type === 'database'){
      deleteUrl = 'db/'+this.props.dbName+'?connectionId='+this.props.connectionId;
    }
    if(type === 'collection'){
      deleteUrl = this.props.dbName+'/collection/'+this.props.collectionName+'?connectionId='+this.props.connectionId;
    }
    if(type== 'document'){
      deleteUrl = this.props.dbName+'/'+this.props.collectionName+'/document?connectionId='+this.props.connectionId;
        obj["_id"] = this.props.uId;
    }
    if(type === 'GridFS Bucket'){
      deleteUrl = this.props.dbName+'/gridfs/'+this.props.gridFSName+'/dropbucket?connectionId='+this.props.connectionId;
    }
    if(type === 'file'){
      deleteUrl = this.props.dbName+'/gridfs/'+this.props.collectionName+'/dropfile?id=' + this.props.uId+ '&connectionId='+this.props.connectionId;
    }
    var deleteCall = service('DELETE', deleteUrl, obj);
    deleteCall.then(this.success.bind(this), this.failure.bind(this));

  }

  success(data) {
    if (data.response.result) {
      this.setState({successMessage:true});
      this.setState({message:this.props.title+' has been deleted.'});
    }
    if (data.response.error) {
      if (data.response.error){
        this.setState({successMessage:false});
        this.setState({message:'Error in deleteing the '+this.props.title});
      }
    }
    setTimeout(function() { this.closeModal() }.bind(this), 3000);
  }

  failure() {
  }

  clickHandlerNo(){
    this.props.closeModal();
  }

  render () {
    const customStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        overflow              : 'hidden',
        width                 : '25%',
        bottom                : 'auto',
        marginRight           : '-50%',
        padding               : '0px',
        transform             : 'translate(-50%, -50%)',
        zIndex                :  '4'
      }
    };

    return(
      <Modal
        isOpen={this.props.modalIsOpen}
        onRequestClose={this.closeModal.bind(this)}
        style = {customStyles}>
        <div className={deleteStyles.two}>
          <label>Are you sure to delete the {this.props.title} ?</label>
           <div className={!this.state.successMessage? (deleteStyles.errorMessage + ' ' + (this.state.message!='' ? deleteStyles.show : deleteStyles.hidden)) : (this.state.message != '' ? deleteStyles.successMessage : '')}>{this.state.message}</div>
             <div className ={!this.state.successMessage ? (deleteStyles.choiceContainer + ' ' +deleteStyles.showChoice) : (deleteStyles.choiceContainer + ' ' +deleteStyles.hideChoice)}>
               <span onClick={this.clickHandlerNo.bind(this)} value='No' className={deleteStyles.submit} >NO</span>
               <button onClick={this.clickHandlerYes.bind(this)} value='Yes' className={deleteStyles.cancel} >YES</button>
             </div>
        </div>
      </Modal>
    );
  }
}

export default DeleteComponent;
