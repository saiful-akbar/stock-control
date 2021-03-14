import React, { useState } from 'react';
import Toast from 'src/components/Toast';
import { apiDeleteMenuItem } from 'src/services/menuItem';
import DialogDelete from 'src/components/DialogDelete';
import { useNavigate } from 'react-router';

// Main component utama
const MenuItemDelete = ({ open, id, closeDialog, reloadTable, ...props }) => {
  const isMounted = React.useRef(true);
  const navigate = useNavigate();

  /**
   * State
   */
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = React.useState({
    show: false,
    type: null,
    message: ''
  });

  /**
   * mengatasi jika komponen dilepas saat request api belum selesai
   */
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  /**
   * fungsi untuk submit form delete
   */
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await apiDeleteMenuItem(id);

      if (isMounted.current) {
        setToast({
          show: true,
          type: 'success',
          message: res.data.message
        });
        reloadTable();
        setLoading(false);
        closeDialog();
      }
    } catch (err) {
      if (isMounted.current) {
        switch (err.status) {
          case 401:
            window.location.href = '/logout';
            break;

          case 403:
            navigate('/error/forbidden');
            break;

          case 404:
            navigate('/error/notfound');
            break;

          default:
            setToast({
              show: true,
              type: 'error',
              message: `(#${err.status}) ${err.data.message}`
            });
            setLoading(false);
            closeDialog();
            break;
        }
      }
    }
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

  /**
   * main render component
   */
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
        type={toast.type}
        message={toast.message}
        handleClose={() => {
          setToast({
            show: false,
            type: toast.type,
            message: toast.message
          });
        }}
      />
    </>
  );
};

export default MenuItemDelete;
