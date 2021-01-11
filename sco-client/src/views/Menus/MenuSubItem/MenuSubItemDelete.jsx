import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import Toast from 'src/components/Toast';
import { apiDeleteMenuSubItem } from 'src/services/menuSubItem';
import BtnSubmit from 'src/components/BtnSubmit';
import { Alert } from '@material-ui/lab';



// Main component utama
const MenuItemDelete = (props) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = React.useState({ show: false, type: null, message: '' });


  // logout
  const logout = () => {
    window.location.href = '/logout';
  };


  // fungsi untuk submit form delete
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await apiDeleteMenuSubItem(props.id);
      props.reloadTable();
      setToast({
        show: true,
        type: 'success',
        message: res.data.message
      });
    }
    catch (err) {
      if (err.status === 401) {
        logout();
      } else {
        setToast({
          show: true,
          type: 'error',
          message: `(#${err.status}) ${err.data.message}`
        });
      }
    }
    setLoading(false);
    props.closeDialog();
  };


  /**
   * Handle close dialog
   */
  const handleClose = () => {
    if (loading) {
      return;
    } else {
      props.closeDialog();
    }
  }


  // main render component
  return (
    <>
      <Dialog
        open={props.open}
        onClose={handleClose}
        maxWidth='sm'
        fullWidth={true}
        aria-labelledby='dialog-delete'
      >
        <DialogTitle>{'Delete sub menus'}</DialogTitle>

        <DialogContent>
          <Alert severity="error">
            {'Once a menu sub item is deleted, it is permanently deleted along with all data related to this menu sub item. Deleting menu sub items cannot be undone.'}
          </Alert>
        </DialogContent>

        <DialogActions>
          <BtnSubmit
            title='Delete'
            color='primary'
            loading={loading}
            handleSubmit={handleSubmit}
            handleCancel={props.closeDialog}
            variant='contained'
            size='small'
          />
        </DialogActions>
      </Dialog>

      <Toast
        open={toast.show}
        handleClose={() => {
          setToast({
            show: false,
            type: toast.type,
            message: toast.message
          })
        }}
        type={toast.type}
        message={toast.message}
      />
    </>
  );
};

export default MenuItemDelete;
