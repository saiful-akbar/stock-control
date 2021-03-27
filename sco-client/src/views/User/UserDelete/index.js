import React from 'react';
import { useDispatch } from 'react-redux';
import { apiDeleteUser } from 'src/services/user';
import DialogDelete from 'src/components/DialogDelete';
import { useNavigate } from 'react-router';

function UserDelete(props) {
  const [loading, setLoading] = React.useState(false);
  const isMounted = React.useRef(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  /* Fungsi untuk submit form */
  const handleSubmit = () => {
    setLoading(true);

    dispatch(apiDeleteUser(props.userId))
      .then(() => {
        if (isMounted.current) {
          setLoading(false);
          props.onCloseDialog();
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

  /* Fungsi menutup dialog */
  const handleClose = () => {
    if (!loading) props.onCloseDialog();
  };

  return (
    <DialogDelete
      open={props.open}
      onClose={handleClose}
      loading={loading}
      onDelete={handleSubmit}
    />
  );
}

export default UserDelete;
