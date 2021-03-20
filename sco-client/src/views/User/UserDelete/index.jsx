import React from 'react';
import { connect } from 'react-redux';
import { apiDeleteUser } from 'src/services/user';
import DialogDelete from 'src/components/DialogDelete';
import { useNavigate } from 'react-router';

function UserDelete(props) {
  const [loading, setLoading] = React.useState(false);
  const isMounted = React.useRef(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  /* Fungsi untuk submit form */
  const handleSubmit = () => {
    setLoading(true);

    apiDeleteUser(props.userId)
      .then(res => {
        if (isMounted.current) {
          setLoading(false);
          props.setReduxToast({
            show: true,
            type: 'success',
            message: res.data.message
          });
          props.onReloadTable();
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
              props.setReduxToast({
                show: true,
                type: 'error',
                message: `(#${err.status}) ${err.data.message}`
              });
              break;
          }
        }
      });
  };

  /* Fungsi menutup dialog */
  const handleClose = () => Boolean(!loading) && props.onCloseDialog();

  return (
    <DialogDelete
      open={props.open}
      onClose={handleClose}
      loading={loading}
      onDelete={handleSubmit}
    />
  );
}

function reduxDispatch(dispatch) {
  return {
    setReduxToast: value =>
      dispatch({
        type: 'SET_TOAST',
        value: value
      })
  };
}

export default connect(null, reduxDispatch)(UserDelete);
