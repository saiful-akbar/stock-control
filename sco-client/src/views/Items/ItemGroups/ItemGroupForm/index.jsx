import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  useMediaQuery,
  Typography,
  IconButton
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import BtnSubmit from 'src/components/BtnSubmit';
import { apiAddItemGroup, apiUpdateItemGroup } from 'src/services/itemGroups';
import { connect, useDispatch } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import { makeStyles, useTheme } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';

/* Style ItemGroupImport */
const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  header: {
    margin: 0,
    padding: theme.spacing(2)
  },
  actions: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.dark
  }
}));

/**
 * Komponen utama
 */
function ItemGroupForm(props) {
  const is_mounted = React.useRef(true);
  const navigate = useNavigate();
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  /**
   * State
   */
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState({
    type: 'info',
    message: 'Form with * is required'
  });

  /**
   * Skema validasi untuk form
   */
  const validationSchema = () => {
    return Yup.object().shape({
      group_code: Yup.string('The group code field must be a string.')
        .max(64, 'The group code may not be greater than 64 characters.')
        .required('The group code field is required.'),
      group_name: Yup.string('The group name field must be a string.').required(
        'The group name field is required.'
      )
    });
  };

  /**
   * Handle jika komponen dilepas saat request api belum selesai
   */
  React.useEffect(() => {
    return () => {
      is_mounted.current = false;
    };

    // eslint-disable-next-line
  }, []);

  /**
   * Handle close dialog
   */
  const handleClose = e => {
    if (!loading) {
      setAlert({ type: 'info', message: 'Form with * is required' });
      props.onClose();
    }
  };

  /**
   * Handle saat form di submit
   */
  const handleSubmitForm = async (values, { setErrors }) => {
    setLoading(true);

    try {
      const res =
        props.type === 'Add'
          ? await apiAddItemGroup(values)
          : await apiUpdateItemGroup(props.data.id, values);

      if (is_mounted.current) {
        dispatch({
          type: reduxAction.toast,
          value: {
            show: true,
            type: 'success',
            message: res.data.message
          }
        });
        props.onReloadTable(true);
        setLoading(false);
        handleClose();
      }
    } catch (err) {
      if (is_mounted.current) {
        setLoading(false);
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

          case 422:
            setAlert({ type: 'error', message: err.data.message });
            setErrors(err.data.errors);
            break;

          default:
            setAlert({ type: 'error', message: err.data.message });
            break;
        }
      }
    }
  };

  return (
    <Dialog
      open={props.open}
      fullScreen={fullScreen}
      fullWidth
      scroll="paper"
      maxWidth="md"
    >
      <Formik
        onSubmit={handleSubmitForm}
        validationSchema={validationSchema}
        initialValues={{
          group_code:
            props.type === 'Edit' && props.data !== null
              ? props.data.item_g_code
              : '',
          group_name:
            props.type === 'Edit' && props.data !== null
              ? props.data.item_g_name
              : ''
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          touched,
          values
        }) => (
          <React.Fragment>
            <DialogTitle disableTypography className={classes.header}>
              <Typography variant="h6">{`${props.type} item group`}</Typography>
              <IconButton
                disabled={loading}
                className={classes.closeButton}
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <Alert severity={alert.type}>{alert.message}</Alert>

            <DialogContent>
              <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      type="text"
                      name="group_code"
                      id="group_code"
                      label="Group Code"
                      variant="outlined"
                      margin="dense"
                      disabled={loading}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.group_code}
                      error={Boolean(touched.group_code && errors.group_code)}
                      helperText={touched.group_code && errors.group_code}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={3}
                      type="text"
                      name="group_name"
                      id="group_name"
                      label="Group Name"
                      variant="outlined"
                      margin="dense"
                      disabled={loading}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.group_name}
                      error={Boolean(touched.group_name && errors.group_name)}
                      helperText={touched.group_name && errors.group_name}
                    />
                  </Grid>
                </Grid>
              </form>
            </DialogContent>

            <DialogActions className={classes.actions}>
              <BtnSubmit
                variant="contained"
                title={props.type === 'Add' ? 'Add' : 'Update'}
                loading={loading}
                handleCancel={handleClose}
                handleSubmit={handleSubmit}
              />
            </DialogActions>
          </React.Fragment>
        )}
      </Formik>
    </Dialog>
  );
}

/**
 * Default props untuk komponent ItemGroupForm
 */
ItemGroupForm.defaultProps = {
  data: null,
  open: false,
  type: 'Add',
  onReloadTable: e => e.preventDefault(),
  onClose: e => e.preventDefault()
};

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

export default connect(null, reduxDispatch)(ItemGroupForm);
