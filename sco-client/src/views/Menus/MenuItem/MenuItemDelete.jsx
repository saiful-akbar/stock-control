import React, { useState } from 'react';
import { apiDeleteMenuItem } from 'src/services/menuItem';
import DialogDelete from 'src/components/DialogDelete';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';

/**
 * Komponen utama
 *
 * @param {*} param0
 */
const MenuItemDelete = ({ open, id, closeDialog }) => {
  const [loading, setLoading] = useState(false);

  const isMounted = React.useRef(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    dispatch(apiDeleteMenuItem(id))
      .then(() => {
        if (isMounted.current) {
          setLoading(false);
          closeDialog();
        }
      })
      .catch(err => {
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
              setLoading(false);
              closeDialog();
              break;
          }
        }
      });
  };

  /**
   * Handle close dialog
   */
  const handleClose = () => {
    if (!loading) closeDialog();
  };

  /**
   * main render component
   */
  return (
    <DialogDelete
      open={open}
      onClose={handleClose}
      loading={loading}
      onDelete={handleSubmit}
    />
  );
};

export default MenuItemDelete;
