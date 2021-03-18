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
function UserClearLogs({ userId, open, onReloadTable, onCloseDialog }) {
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
    apiClearUserLogs(userId)
      .then(res => {
        if (isMounted.current) {
          setLoading(false);
          onReloadTable();
          dispatch({
            type: 'SET_TOAST',
            value: {
              show: true,
              type: 'success',
              message: res.data.message
            }
          });
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
              dispatch({
                type: 'SET_TOAST',
                value: {
                  show: true,
                  type: 'error',
                  message: `(#${err.status}) ${err.data.message}`
                }
              });
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
