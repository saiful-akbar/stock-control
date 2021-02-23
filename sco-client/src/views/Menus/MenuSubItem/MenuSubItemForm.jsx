import React, { useState, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
  InputLabel,
  DialogTitle,
  useMediaQuery,
  Typography,
  IconButton
} from '@material-ui/core';
import {
  apiCreateMenuSubItem,
  apiUpdateMenuSubItem
} from 'src/services/menuSubItem';
import { Alert } from '@material-ui/lab';
import { makeStyles, useTheme } from '@material-ui/styles';
import Toast from 'src/components/Toast';
import BtnSubmit from 'src/components/BtnSubmit';
import CloseIcon from '@material-ui/icons/Close';

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
  }
}));

// Main component
const MenuSubItemForm = props => {
  const isMounted = useRef(true);
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = React.useState({
    show: false,
    type: null,
    message: ''
  });
  const [alert, setAlert] = React.useState({
    type: 'info',
    message: 'Fields marked with * are required'
  });

  // mengatasi ketika komponen dilepas
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  // logout
  const logout = () => {
    window.location.href = 'logout';
  };

  // validasi form formik
  const getValidationSchema = value => {
    return Yup.object().shape({
      menus: Yup.string().required('Menus is required'),
      title: Yup.string()
        .max(128)
        .required('Title is required'),
      url: Yup.string()
        .max(128)
        .required('Url is required')
    });
  };

  // submit form
  const handleSubmitForm = async (data, { setErrors }) => {
    setLoading(true);
    try {
      let res =
        props.type === 'Create'
          ? await apiCreateMenuSubItem(data)
          : await apiUpdateMenuSubItem(props.data.id, data);
      if (isMounted.current) {
        setLoading(false);
        setToast({ show: true, type: 'success', message: res.data.message });
        props.reloadTable();
        props.closeDialog();
      }
    } catch (err) {
      if (isMounted.current) {
        setLoading(false);
        if (err.status === 401) {
          logout();
        } else {
          if (err.status === 422) setErrors(err.data.errors);
          setAlert({ type: 'error', message: err.data.message });
          setToast({
            show: true,
            type: 'error',
            message: `#${err.status} ${err.data.message}`
          });
        }
      }
    }
  };

  /* Handle close dialog */
  const handleCloseDialog = () => {
    if (!loading) {
      setAlert({ type: 'info', message: 'Fields marked with * are required' });
      props.closeDialog();
    } else {
      return;
    }
  };

  return (
    <>
      <Dialog
        fullWidth
        fullScreen={fullScreen}
        maxWidth="md"
        scroll="paper"
        open={props.open}
        onClose={handleCloseDialog}
      >
        <Formik
          initialValues={{
            menus: props.type === 'Update' ? props.data.menu_item_id : '',
            title: props.type === 'Update' ? props.data.menu_s_i_title : '',
            url: props.type === 'Update' ? props.data.menu_s_i_url : ''
          }}
          validationSchema={getValidationSchema}
          onSubmit={handleSubmitForm}
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
                <Typography variant="h6">
                  {props.type === 'Create' ? 'Create a new' : 'Update'} sub menu
                </Typography>
                <IconButton
                  disabled={loading}
                  className={classes.closeButton}
                  onClick={handleCloseDialog}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <Alert severity={alert.type}>{alert.message}</Alert>

              <DialogContent dividers>
                <form onSubmit={handleSubmit} autoComplete="off">
                  <Grid container spacing={2} mt={2} mb={2}>
                    <Grid item xs={12}>
                      <FormControl
                        required
                        fullWidth
                        variant="outlined"
                        disabled={loading}
                        error={Boolean(touched.menus && errors.menus)}
                      >
                        <InputLabel id="menus">{'Menus'}</InputLabel>
                        <Select
                          labelId="menus"
                          name="menus"
                          label="Menus *"
                          value={values.menus}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <MenuItem value="" disabled>
                            {'None'}
                          </MenuItem>
                          {props.menuItems.map(data => (
                            <MenuItem key={data.id} value={data.id}>
                              {data.menu_i_title}
                            </MenuItem>
                          ))}
                        </Select>

                        <FormHelperText>
                          {touched.menus && errors.menus}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        required
                        label="Title"
                        name="title"
                        type="text"
                        variant="outlined"
                        disabled={loading}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.title}
                        error={Boolean(touched.title && errors.title)}
                        helperText={touched.title && errors.title}
                      />
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        required
                        label="Url"
                        name="url"
                        type="text"
                        variant="outlined"
                        disabled={loading}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.url}
                        error={Boolean(touched.url && errors.url)}
                        helperText={touched.url && errors.url}
                      />
                    </Grid>
                  </Grid>

                  <button type="submit" style={{ display: 'none' }} />
                </form>
              </DialogContent>

              <DialogActions>
                <BtnSubmit
                  title={props.type}
                  loading={loading}
                  handleSubmit={handleSubmit}
                  handleCancel={handleCloseDialog}
                  variant="contained"
                />
              </DialogActions>
            </React.Fragment>
          )}
        </Formik>
      </Dialog>

      <Toast
        open={toast.show}
        type={toast.type}
        message={toast.message}
        handleClose={() => {
          setToast({
            show: false,
            type: toast.type,
            message: toast.message
          });
        }}
      />
    </>
  );
};

export default MenuSubItemForm;
