import React from 'react';
import DialogDelete from 'src/components/DialogDelete';
import { useDispatch } from 'react-redux';
import { apiClearUserLogs } from 'src/services/user';
import { useNavigate } from 'react-router';

/**
 * Komponen utama UserClearLogs
 *
 * @param {*} param0
 */
function UserClearLogs({ userId, open, onCloseDialog }) {
  const isMounted = React.useRef(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  /**
   * Fungsi menutup dialog
   */
  const handleCloseDialog = () => !loading && onCloseDialog();

  /**
   * Fungsi untuk celar user logs
   */
  const handleClearUserLogs = () => {
    setLoading(true);
    dispatch(apiClearUserLogs(userId))
      .then(() => {
        if (isMounted.current) {
          setLoading(false);
          onCloseDialog();
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
              break;
          }
        }
      });
  };

  return (
    <DialogDelete
      title="Clear Logs"
      contentText="Are you sure you want to clear all logs"
      buttonTitle="Clear"
      open={open}
      onClose={handleCloseDialog}
      loading={loading}
      onDelete={handleClearUserLogs}
    />
  );
}

export default UserClearLogs;
