import React, { useState } from 'react';
import Toast from 'src/components/Toast';
import { apiDeleteMenuSubItem } from 'src/services/menuSubItem';
import DialogDelete from 'src/components/DialogDelete';

// Main component utama
const MenuItemDelete = props => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = React.useState({
    show: false,
    type: null,
    message: ''
  });

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
    } catch (err) {
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
  };

  // main render component
  return (
    <>
      <DialogDelete
        open={props.open}
        onClose={handleClose}
        loading={loading}
        onDelete={handleSubmit}
      />

      <Toast
        open={toast.show}
        handleClose={() => {
          setToast({
            show: false,
            type: toast.type,
            message: toast.message
          });
        }}
        type={toast.type}
        message={toast.message}
      />
    </>
  );
};

export default MenuItemDelete;
