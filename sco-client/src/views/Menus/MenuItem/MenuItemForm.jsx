import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  Typography,
  IconButton
} from '@material-ui/core';
import { apiCreateMenuItem, apiUpdateMenuItem } from 'src/services/menuItem';
import BtnSubmit from 'src/components/BtnSubmit';
import { Alert } from '@material-ui/lab';
import { makeStyles, useTheme } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';

/**
 * Style
 */
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
  content: {
    padding: theme.spacing(2)
  },
  actions: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.dark
  }
}));

/*
 * main component
 */
const MenuItemForm = props => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState({
    type: 'info',
    message: 'Fields marked with * are required'
  });

  // Handle close dialog
  const handleCloseDialog = () => {
    if (!loading) {
      props.onClose();
    }
  };

  // Handle submit form
  const handleSubmitForm = async (values, { setErrors }) => {
    setLoading(true);
    let res =
      props.type.toLowerCase() === 'create'
        ? await apiCreateMenuItem(values).catch(err => err)
        : await apiUpdateMenuItem(props.data.id, values).catch(err => err);

    if (res.status === 200) {
      props.setReduxToast(true, 'success', res.data.message);
      props.onReloadTable();
      setLoading(false);
      handleCloseDialog();
    } else if (res.status === 401) {
      window.location.href = '/logout';
    } else {
      res.status === 422 && setErrors(res.data.errors);
      setLoading(false);
      setAlert({
        type: 'error',
        message: `(#${res.status}) ${res.data.message}`
      });
      props.setReduxToast(
        true,
        'success',
        `(#${res.status}) ${res.data.message}`
      );
    }
  };

  // Render komponen utama
  return (
    <Dialog
      fullWidth
      scroll="paper"
      maxWidth="md"
      fullScreen={fullScreen}
      open={props.open}
    >
      <Formik
        onSubmit={handleSubmitForm}
        initialValues={{
          title: Boolean(
            props.type.toLowerCase() === 'edit' && props.data !== null
          )
            ? props.data.menu_i_title
            : ''
        }}
        validationSchema={Yup.object().shape({
          title: Yup.string('The title title field must be a string.')
            .max(100, 'The title may not be greater than 100 characters.')
            .required('The title field is required.')
        })}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          touched,
          values
        }) => (
          <>
            <DialogTitle disableTypography className={classes.header}>
              <Typography variant="h6">{`${props.type} Menu`}</Typography>
              <IconButton
                disabled={loading}
                className={classes.closeButton}
                onClick={handleCloseDialog}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <Alert severity={alert.type}>{alert.message}</Alert>

            <DialogContent className={classes.content}>
              <form onSubmit={handleSubmit} autoComplete="off">
                <Grid container spacing={2} mt={2} mb={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      name="title"
                      type="text"
                      variant="outlined"
                      label="Title"
                      disabled={loading}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.title}
                      error={Boolean(touched.title && errors.title)}
                      helperText={touched.title && errors.title}
                    />
                  </Grid>
                </Grid>
              </form>
            </DialogContent>

            <DialogActions className={classes.actions}>
              <BtnSubmit
                title="Create"
                loading={loading}
                handleSubmit={handleSubmit}
                handleCancel={handleCloseDialog}
                variant="contained"
              />
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
};

/* redux reducer */
function reduxReducer(dispatch) {
  return {
    setReduxToast: (show, type, message) =>
      dispatch({
        type: reduxAction.toast,
        value: { show: show, type: type, message: message }
      })
  };
}

export default connect(null, reduxReducer)(MenuItemForm);
