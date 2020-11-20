import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Zoom,
} from '@material-ui/core';
import Toast from 'src/components/Toast';
import { apiDeleteMenuItem } from 'src/services/menuItem';
import BtnSubmit from 'src/components/BtnSubmit';
import { Alert } from '@material-ui/lab';


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
            message: `#${err.status} ${err.statusText}`
          });
          break;
      }
    }
    setLoading(false);
    closeDialog();
  }


  // main render component
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        maxWidth='sm'
        fullWidth={true}
        aria-labelledby='dialog-delete'
        aria-describedby="delete-description"
      >
        <DialogTitle>Delete menu item</DialogTitle>

        <DialogContent>
          <Alert severity="error">
            <DialogContentText id="delete-description">
              {'Once a menu item is deleted, it is permanently deleted along with all data related to this menu item. Deleting menu items cannot be undone.'}
            </DialogContentText>
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
