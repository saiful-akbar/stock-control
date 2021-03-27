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
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

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
  const navigate = useNavigate();
  const isMounted = React.useRef(true);
  const dispatch = useDispatch();

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState({
    type: 'info',
    message: 'Fields marked with * are required'
  });

  /**
   * mengatasi jika komponen dilepas saat request api belum selesai
   */
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  // Handle close dialog
  const handleCloseDialog = () => {
    if (!loading) {
      setAlert({
        type: 'info',
        message: 'Fields marked with * are required'
      });
      props.onClose();
    }
  };

  // Handle submit form
  const handleSubmitForm = async (values, { setErrors }) => {
    setLoading(true);
    setAlert({
      type: 'warning',
      message: `Processing ... don't leave or reload the page`
    });

    try {
      if (props.type.toLowerCase() === 'create') {
        await dispatch(apiCreateMenuItem(values));
      } else {
        await dispatch(apiUpdateMenuItem(props.data.id, values));
      }

      if (isMounted.current) {
        setLoading(false);
        handleCloseDialog();
      }
    } catch (err) {
      if (isMounted.current) {
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

          default:
            if (err.status === 422) setErrors(err.data.errors);
            setAlert({
              type: 'error',
              message: `(#${err.status}) ${err.data.message}`
            });
            break;
        }
      }
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
                title={
                  props.type.toLowerCase() === 'create' ? 'Create' : 'Update'
                }
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

export default MenuItemForm;
