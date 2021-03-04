import React, { useState } from 'react';
import Toast from 'src/components/Toast';
import { apiDeleteMenuItem } from 'src/services/menuItem';
import DialogDelete from 'src/components/DialogDelete';

// Main component utama
const MenuItemDelete = ({ open, id, closeDialog, reloadTable, ...props }) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = React.useState({
    show: false,
    type: null,
    message: ''
  });

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
    } catch (err) {
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
  };

  /**
   * Handle close dialog
   */
  const handleClose = () => {
    if (loading) {
      return;
    } else {
      closeDialog();
    }
  };

  // main render component
  return (
    <>
      <DialogDelete
        open={open}
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
