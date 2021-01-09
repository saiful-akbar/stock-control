import React from 'react';
import {
  useNavigate
} from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import BtnSubmit from 'src/components/BtnSubmit';
import { apiAddItemGroup } from 'src/services/itemGroups';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';


/**
 * Komponen utama
 */
function ItemGroupForm(props) {
  const is_mounted = React.useRef(true);
  const navigate = useNavigate();


  /**
   * State
   */
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({
    field: {},
    type: 'info',
    message: 'Form with * is required'
  });
  const [values, setValues] = React.useState({
    id: '',
    group_code: '',
    group_name: '',
  });


  /**
   * Handle jika komponen dilepas saat request api belum selesai
   */
  React.useEffect(() => {
    return () => {
      is_mounted.current = false;
    }

    // eslint-disable-next-line
  }, []);


  /**
   * Cek props.type aksi
   */
  React.useEffect(() => {
    if (props.type === 'Edit' && props.data !== null) {
      setValues({
        id: props.data.id,
        group_code: props.data.item_g_code,
        group_name: props.data.item_g_name,
      });
    } else {
      setValues({
        id: '',
        group_code: '',
        group_name: '',
      });
    }
  }, [props.type, props.data]);


  /**
   * Handle close dialog
   */
  const handleClose = () => {
    if (!loading) {
      setValues({
        id: '',
        group_code: '',
        group_name: '',
      });
      setErrors({
        field: {},
        type: 'info',
        message: 'Form with * is required'
      });
      props.onClose();
    } else {
      return;
    }
  }


  /**
   * Handle saat form diisi
   */
  const handleChange = (e) => {
    let newValues = { ...values };
    newValues[e.target.name] = e.target.value;
    setValues(newValues);
  }


  /**
   * Handle saat form di submit
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (props.type === 'Add') {
      handleAdd();
    } else if (props.type === 'Edit') {
      handleUpdate();
    }
  }


  /**
   * Handle add item group
   */
  const handleAdd = async () => {
    try {
      const res = await apiAddItemGroup(values);
      if (is_mounted.current) {
        setLoading(false);
        props.setReduxToats(true, 'success', res.data.message);
        props.onReloadTable(true);
        handleClose();
      }
    } catch (err) {
      if (is_mounted.current) {
        setLoading(false);
        props.setReduxToats(true, 'error', `(#${err.status}) ${err.data.message}`);

        if (err.status === 401) {
          window.location.href = '/logout';
        }
        else if (err.status === 403) {
          navigate('/error/forbidden');
        }
        else if (err.status === 404) {
          navigate('/error/notfound');
        }
        else if (err.status === 422) {
          setErrors({
            field: err.data.errors,
            type: 'error',
            message: err.data.message
          });
        }
      }
    }
  }


  /**
   * handle update item group
   */
  const handleUpdate = async () => {

  }


  return (
    <Dialog
      fullWidth
      scroll='paper'
      maxWidth='md'
      open={props.open}
      onClose={handleClose}
    >
      <DialogTitle>
        {`${props.type} item group`}
      </DialogTitle>

      <Alert severity={errors.type}>
        {errors.message}
      </Alert>

      <DialogContent>
        <form onSubmit={handleSubmit} autoComplete='off'>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id='group-code'
                label='Group Code *'
                variant='outlined'
                name='group_code'
                type='text'
                margin='dense'
                disabled={loading}
                onChange={handleChange}
                value={values.group_code}
                error={Boolean(errors.field.group_code)}
                helperText={errors.field.group_code}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                margin='dense'
                id='group-name'
                label='Group Name *'
                variant='outlined'
                name='group_name'
                type='text'
                disabled={loading}
                onChange={handleChange}
                value={values.group_name}
                error={Boolean(errors.field.group_name)}
                helperText={errors.field.group_name}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <BtnSubmit
          variant='contained'
          title={props.type === 'Add' ? 'Add' : 'Update'}
          loading={loading}
          handleCancel={handleClose}
          handleSubmit={handleSubmit}
        />
      </DialogActions>
    </Dialog>
  )

}


/**
 * Default props untuk komponent ItemGroupForm
 */
ItemGroupForm.defaultProps = {
  data: null,
  open: false,
  type: 'Add',
  onReloadTable: (e) => e.preventDefault(),
  onClose: (e) => e.preventDefault(),
};


function reduxDispatch(dispatch) {
  return {
    setReduxToats: (show, type, message) => dispatch({
      type: reduxAction.toast,
      value: {
        show: show,
        type: type,
        message: message
      }
    }),
  }
}


export default connect(null, reduxDispatch)(ItemGroupForm);