import React, { Component } from 'react';
import { reduxAction } from 'src/config/redux/state';
import { connect } from 'react-redux';
import { apiDeleteUser } from 'src/services/user';
import DialogDelete from 'src/components/DialogDelete';

class UserDelete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.mounted = true;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * Fungsi untuk submit form
   */
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
        } else {
          this.setState({ loading: false });
          this.props.setReduxToast({
            show: true,
            type: 'error',
            message: `(#${err.status}) ${err.data.message}`
          });
        }
      }
    }
  }

  /**
   * Fungsi menutup dialog
   */
  handleClose() {
    if (!this.state.loading) {
      this.props.closeDialog();
    } else {
      return;
    }
  }

  render() {
    return (
      <DialogDelete
        open={this.props.open}
        onClose={this.handleClose}
        loading={this.state.loading}
        onDelete={this.handleSubmit}
      />
    );
  }
}

function reduxDispatch(dispatch) {
  return {
    setReduxToast: value =>
      dispatch({
        type: reduxAction.toast,
        value: value
      })
  };
}

export default connect(null, reduxDispatch)(UserDelete);
