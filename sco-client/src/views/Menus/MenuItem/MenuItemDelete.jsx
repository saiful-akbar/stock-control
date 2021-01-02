import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Zoom,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Toast from 'src/components/Toast';
import BtnSubmit from 'src/components/BtnSubmit';
import { apiDeleteMenuItem } from 'src/services/menuItem';


// animasi
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

// Main component utama
const MenuItemDelete = ({
  open,
  id,
  closeDialog,
  reloadTable,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = React.useState({ show: false, type: null, message: '' });


  // fungsi untuk submit form delete
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await apiDeleteMenuItem(id);
      reloadTable();
      setToast({
        show: true,
        type: 'success',
        message: res.data.message
      });
    }
    catch (err) {
      switch (err.status) {
        case 401:
          window.location.href = '/logout';
          break;

        default:
          setToast({
            show: true,
            type: 'error',
            message: `(#${err.status}) ${err.data.message}`
          });
          break;
      }
    }
    setLoading(false);
    closeDialog();
  }


  /**
   * Handle close dialog
   */
  const handleClose = () => {
    if (loading) {
      return;
    } else {
      closeDialog();
    }
  }


  // main render component
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth='sm'
        fullWidth={true}
        aria-labelledby='dialog-delete'
      >
        <DialogTitle>Delete menus</DialogTitle>

        <DialogContent>
          <Alert severity="error">
            {'Once a menu item is deleted, it is permanently deleted along with all data related to this menu item. Deleting menu items cannot be undone.'}
          </Alert>
        </DialogContent>

        <DialogActions>
          <BtnSubmit
            title='Delete'
            color='primary'
            loading={loading}
            handleSubmit={handleSubmit}
            handleCancel={() => closeDialog()}
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
