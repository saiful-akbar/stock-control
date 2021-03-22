import React, { useState } from 'react';
import { apiDeleteMenuSubItem } from 'src/services/menuSubItem';
import DialogDelete from 'src/components/DialogDelete';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';

/**
 * Main component utama
 * @param {any} props
 */
const MenuItemDelete = props => {
  const navigate = useNavigate();
  const isMounted = React.useRef(true);
  const dispatch = useDispatch();

  /**
   * State
   */
  const [loading, setLoading] = useState(false);

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

    dispatch(apiDeleteMenuSubItem(props.id))
      .then(() => {
        if (isMounted.current) {
          setLoading(false);
          handleClose();
        }
      })
      .catch(err => {
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
              setLoading(false);
              break;
          }
        }
      });
  };

  /**
   * Handle close dialog
   */
  const handleClose = () => {
    if (!loading) props.closeDialog();
  };

  /**
   * main render component
   */
  return (
    <DialogDelete
      open={props.open}
      onClose={handleClose}
      loading={loading}
      onDelete={handleSubmit}
    />
  );
};

export default MenuItemDelete;
