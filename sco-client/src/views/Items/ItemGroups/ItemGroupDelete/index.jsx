import React from 'react';
import BtnSubmit from 'src/components/BtnSubmit';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { apiDeleteItemGroup } from 'src/services/itemGroups';


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
    }

    // eslint-disable-next-line
  }, []);


  /**
   * Fungsi untuk menutup dialog delete
   * @param {*} e 
   */
  const handleCloseDialog = (e) => {
    if (!loading) {
      props.onClose();
    } else {
      e.preventDefault();
    }
  }


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
        props.setReduxToast(true, 'error', `(#${err.status}) ${err.data.message}`);
        setLoading(false);

        if (err.status === 401) {
          window.location.href = '/logout';
        }
        else if (err.status === 403) {
          navigate('/error/forbidden');
        }
        else if (err.status === 404) {
          navigate('/error/notfound');
        }
      }
    }
  }

  return (
    <Dialog
      open={props.open}
      onClose={handleCloseDialog}
      maxWidth='sm'
      fullWidth={true}
    >
      <DialogTitle>{'Delete item group'}</DialogTitle>

      <DialogContent>
        <Alert severity="error">
          <div>
            <p>Are you sure you want to permanently delete this data ?</p>
            <p>All data related to this data will also be permanently deleted.</p>
            <p>Deleted data cannot be recovered.</p>
          </div>
        </Alert>
      </DialogContent>

      <DialogActions>
        <BtnSubmit
          size='small'
          title='Delete'
          color='primary'
          variant='contained'
          loading={loading}
          handleSubmit={handleSubmit}
          handleCancel={handleCloseDialog}
        />
      </DialogActions>
    </Dialog>
  )
}


ItemGroupDelete.defaultProps = {
  open: false,
  data: [],
  onClose: (e) => e.preventDefault(),
  onReloadTable: (e) => e.preventDefault(),
}


/**
 * Redux dispatch
 * 
 * @param {*} dispatch 
 */
function reduxDispatch(dispatch) {
  return {
    setReduxToast: (show, type, message) => dispatch({
      type: reduxAction.toast,
      value: {
        show: show,
        type: type,
        message: message
      }
    })
  }
}


export default connect(null, reduxDispatch)(ItemGroupDelete);