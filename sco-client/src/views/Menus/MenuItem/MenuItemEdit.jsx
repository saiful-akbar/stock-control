import React, { useEffect, useState, useRef } from 'react';
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
  DialogTitle
} from '@material-ui/core';
import Toast from 'src/components/Toast';
import BtnSubmit from 'src/components/BtnSubmit';
import { apiUpdateMenuItem } from 'src/services/menuItem';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';


/**
 * Style
 */
const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: theme.palette.background.topBar,
    color: '#ffffff',
  },
}));


/* Component utama */
const MenuItemEdit = (props) => {
  const isMounted = useRef(true);
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = React.useState({ show: false, type: null, message: '' });
  const [alert, setAlert] = React.useState({ type: 'info', message: 'Fields marked with * are required' });


  /* cek apakan component dicopot */
  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
    // eslint-disable-next-line
  }, []);


  /* validasi form formik */
  const getValidationSchema = (value) => {
    return Yup.object().shape({
      title: Yup.string().max(128).required('Title is required'),
      url: Yup.string().max(128).required('Url is required'),
      icon: Yup.string().max(128).required('Icon is required'),
      children: Yup.boolean()
    });
  };


  /* sungsi submit form */
  const handleSubmitForm = async (data, { setErrors }) => {
    setLoading(true);
    try {
      const res = await apiUpdateMenuItem(props.data.id, data);
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
          window.location.href = '/logout';
        }
        else {
          err.status === 422 && setErrors(err.data.errors);
          setAlert({ type: 'error', message: err.data.message });
          setToast({
            show: true,
            type: 'error',
            message: `(#${err.status}) ${err.data.message}`
          });
        }
      }
    }
  }


  /* Handle close dialog */
  const handleCloseDialog = () => {
    if (!loading) {
      props.closeDialog();
      setAlert({ type: 'info', message: 'Fields marked with * are required' });
    } else {
      return;
    }
  }


  return (
    <>
      <Dialog
        fullWidth
        maxWidth='md'
        scroll='paper'
        open={props.open}
        onClose={handleCloseDialog}
      >
        <Formik
          initialValues={{
            title: props.data.menu_i_title,
            url: props.data.menu_i_url,
            icon: props.data.menu_i_icon,
            children: props.data.menu_i_children
          }}
          validationSchema={getValidationSchema}
          onSubmit={(handleSubmitForm)}
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
                <DialogTitle className={classes.header}>{'Update menu'}</DialogTitle>

                <Alert severity={alert.type}>
                  {alert.message}
                </Alert>

                <DialogContent dividers={true}>
                  <form onSubmit={handleSubmit} autoComplete='off'>
                    <Grid container spacing={2} mt={2} mb={2}>
                      <Grid item md={6} xs={12} >
                        <TextField
                          fullWidth
                          required
                          name='title'
                          type='text'
                          variant='outlined'
                          label='Title'
                          disabled={loading}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.title}
                          helperText={touched.title && errors.title}
                          error={Boolean(touched.title && errors.title)}
                        />
                      </Grid>

                      <Grid item md={6} xs={12} >
                        <TextField
                          fullWidth
                          required
                          disabled={loading}
                          name='url'
                          type='text'
                          variant='outlined'
                          label='Url'
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.url}
                          error={Boolean(touched.url && errors.url)}
                          helperText={touched.url && errors.url}
                        />
                      </Grid>

                      <Grid item md={6} xs={12} >
                        <TextField
                          fullWidth
                          required
                          disabled={loading}
                          label='Icon'
                          name='icon'
                          type='text'
                          variant='outlined'
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.icon}
                          error={Boolean(touched.icon && errors.icon)}
                          helperText={
                            Boolean(touched.icon && errors.icon)
                              ? touched.icon && errors.icon
                              : 'Use material design icons'
                          }
                        />
                      </Grid>

                      <Grid item md={6} xs={12} >
                        <FormControl
                          required
                          fullWidth
                          variant='outlined'
                          disabled={loading}
                          error={Boolean(touched.children && errors.children)}
                        >
                          <InputLabel id='children'>Children</InputLabel>
                          <Select
                            labelId='children'
                            name='children'
                            value={values.children}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label='Children *'
                            required
                          >
                            <MenuItem value='1' checked={Boolean(values.children === 1)}>Yes</MenuItem>
                            <MenuItem value='0' checked={Boolean(values.children === 0)} >No</MenuItem>
                          </Select>
                          <FormHelperText>{touched.children && errors.children}</FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <button type='submit' style={{ display: 'none' }} />
                  </form>
                </DialogContent>

                <DialogActions>
                  <BtnSubmit
                    title='Update'
                    loading={loading}
                    handleSubmit={handleSubmit}
                    handleCancel={handleCloseDialog}
                    variant='contained'
                  />
                </DialogActions>
              </>
            )}
        </Formik>
      </Dialog>

      <Toast
        open={toast.show}
        handleClose={() => {
          setToast({
            show: false,
            type: toast.type,
            message: toast.message
          })
        }}
        type={toast.type}
        message={toast.message}
      />
    </>
  );
};

export default MenuItemEdit;