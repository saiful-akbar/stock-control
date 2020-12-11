import React, { useEffect, useState, useRef } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Zoom,
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
  InputLabel,
} from '@material-ui/core';
import Toast from 'src/components/Toast';
import BtnSubmit from 'src/components/BtnSubmit';
import { apiUpdateMenuItem } from 'src/services/menuItem';
import { Alert } from '@material-ui/lab';


// animasi dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});


// Component utama
const MenuItemEdit = (props) => {
  const isMounted = useRef(true);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = React.useState({ show: false, type: null, message: '' });


  // cek apakan component dicopot
  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
    // eslint-disable-next-line
  }, []);


  // validasi form formik
  const getValidationSchema = (value) => {
    return Yup.object().shape({
      title: Yup.string().max(128).required('Title is required'),
      url: Yup.string().max(128).required('Url is required'),
      icon: Yup.string().max(128).required('Icon is required'),
      children: Yup.boolean()
    });
  };


  // sungsi submit form
  const handleSubmitForm = async (data, { setErrors }) => {
    setLoading(true);
    try {
      const res = await apiUpdateMenuItem(props.data.id, data);
      if (isMounted.current) {
        setToast({ show: true, type: 'success', message: res.data.message });
        props.reloadTable();
        props.closeDialog();
      }
    } catch (err) {
      if (isMounted.current) {
        if (err.status === 401) {
          window.location.href = '/logout';
        }
        else {
          err.status === 422 && setErrors(err.data.errors);
          setToast({
            show: true,
            type: 'error',
            message: `(#${err.status}) ${err.statusText}`
          });
        }
      }
    }
    setLoading(false);
  }


  return (
    <>
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        maxWidth='lg'
        scroll='paper'
        fullWidth={true}
        aria-labelledby='dialog-edit-title'
      >
        <DialogTitle id='dialog-edit-title'>{'Update menus'}</DialogTitle>

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
                <DialogContent dividers={true}>
                  <Alert severity='info'>Fields marked with * are required</Alert>

                  <Grid
                    style={{ marginTop: 10 }}
                    container
                    direction='row'
                    justify='center'
                    alignItems='center'
                    spacing={3}
                  >
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
                        helperText={touched.url && errors.url}
                        error={Boolean(touched.url && errors.url)}
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
                        helperText={touched.icon && errors.icon}
                        error={Boolean(touched.icon && errors.icon)}
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
                          <MenuItem value='1' checked={values.children === 1 ? true : false}>Yes</MenuItem>
                          <MenuItem value='0' checked={values.children === 0 ? true : false} >No</MenuItem>
                        </Select>
                        <FormHelperText>{touched.children && errors.children}</FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                </DialogContent>

                <DialogActions>
                  <BtnSubmit
                    title='Update'
                    loading={loading}
                    disabled={loading}
                    handleSubmit={handleSubmit}
                    handleCancel={props.closeDialog}
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