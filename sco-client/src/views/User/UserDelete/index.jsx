import React, { Component } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Zoom,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import BtnSubmit from 'src/components/BtnSubmit';
import { reduxAction } from 'src/config/redux/state';
import { connect } from 'react-redux';
import { apiDeleteUser } from 'src/services/user';


// animasi
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});


class UserDelete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.mounted = true;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    this.mounted = false;
  }



  async handleSubmit() {
    this.setState({ loading: true });
    try {
      let res = await apiDeleteUser(this.props.userId);
      if (this.mounted) {
        this.setState({ loading: false });
        this.props.reloadTable();
        this.props.setReduxToast({
          show: true,
          type: 'success',
          message: res.data.message
        });
        this.props.closeDialog();
      }
    } catch (err) {
      if (this.mounted) {
        if (err.status === 401) {
          window.location.href = '/logout';
        }
        else {
          this.setState({ loading: false });
          this.props.setReduxToast({
            show: true,
            type: 'error',
            message: err.data.message
          });
        }
      }
    }
  }


  render() {
    const { open, closeDialog } = this.props;
    return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        maxWidth='sm'
        fullWidth={true}
        aria-labelledby='dialog-delete'
        aria-describedby="delete-description"
      >
        <DialogTitle>Delete user</DialogTitle>

        <DialogContent>
          <Alert severity="error">
            <DialogContentText id="delete-description">
              {'Once a user is deleted, it is permanently deleted along with all data related to this user. Deleting user cannot be undone.'}
            </DialogContentText>
          </Alert>
        </DialogContent>

        <DialogActions>
          <BtnSubmit
            title='Delete'
            color='secondary'
            loading={this.state.loading}
            handleSubmit={this.handleSubmit}
            handleCancel={() => closeDialog()}
            variant='contained'
            size='small'
          />
        </DialogActions>
      </Dialog>
    );
  }
}


function reduxDispatch(dispatch) {
  return {
    setReduxToast: (value) => dispatch({
      type: reduxAction.toast,
      value: value
    })
  }
}


export default connect(null, reduxDispatch)(UserDelete);