import React from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import { apiDeleteItemGroup } from 'src/services/itemGroups';
import DialogDelete from 'src/components/DialogDelete';

/**
 * Komponent utama
 */
function ItemGroupDelete(props) {
  const navigate = useNavigate();
  const isMounted = React.useRef(true);
  const [loading, setLoading] = React.useState(false);

  /**
   * Handle jika komponen dilepas saat request api belum selesai
   */
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };

    // eslint-disable-next-line
  }, []);

  /**
   * Fungsi untuk menutup dialog delete
   * @param {*} e
   */
  const handleCloseDialog = e => {
    if (!loading) {
      props.onClose();
    }
  };

  /**
   * Fungsi untuk submit delete
   */
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await apiDeleteItemGroup(props.data);

      if (isMounted.current) {
        props.setReduxToast(true, 'success', res.data.message);
        props.onReloadTable(true);
        setLoading(false);
        handleCloseDialog();
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
            setLoading(false);
            props.setReduxToast(
              true,
              'error',
              `(#${err.status}) ${err.data.message}`
            );
            break;
        }
      }
    }
  };

  return (
    <DialogDelete
      open={props.open}
      loading={loading}
      onDelete={handleSubmit}
      onClose={handleCloseDialog}
    />
  );
}

ItemGroupDelete.defaultProps = {
  open: false,
  data: [],
  onClose: e => e.preventDefault(),
  onReloadTable: e => e.preventDefault()
};

/**
 * Redux dispatch
 *
 * @param {*} dispatch
 */
function reduxDispatch(dispatch) {
  return {
    setReduxToast: (show, type, message) =>
      dispatch({
        type: reduxAction.toast,
        value: {
          show: show,
          type: type,
          message: message
        }
      })
  };
}

export default connect(null, reduxDispatch)(ItemGroupDelete);
