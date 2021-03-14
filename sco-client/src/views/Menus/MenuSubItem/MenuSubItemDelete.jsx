import React, { useState } from 'react';
import Toast from 'src/components/Toast';
import { apiDeleteMenuSubItem } from 'src/services/menuSubItem';
import DialogDelete from 'src/components/DialogDelete';
import { useNavigate } from 'react-router';

/**
 * Main component utama
 * @param {any} props
 */
const MenuItemDelete = props => {
  const navigate = useNavigate();
  const isMounted = React.useRef(true);

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
   * State
   */
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = React.useState({
    show: false,
    type: null,
    message: ''
  });

  /**
   * logout
   */
  const logout = () => {
    window.location.href = '/logout';
  };

  /**
   * fungsi untuk submit form delete
   */
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await apiDeleteMenuSubItem(props.id);

      if (isMounted.current) {
        setToast({
          show: true,
          type: 'success',
          message: res.data.message
        });
        props.reloadTable();
        handleClose();
      }
    } catch (err) {
      if (isMounted.current) {
        switch (err.status) {
          case 401:
            logout();
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
            handleClose();
            break;
        }
      }
    }
  };

  /**
   * Handle close dialog
   */
  const handleClose = () => {
    if (!loading) {
      props.closeDialog();
    }
  };

  /**
   * main render component
   */
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
