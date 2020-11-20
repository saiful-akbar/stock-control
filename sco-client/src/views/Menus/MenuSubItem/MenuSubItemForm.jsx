import React, {
  useState,
  forwardRef,
  useEffect,
  useRef
} from 'react';
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
import { Alert } from '@material-ui/lab';
import Toast from 'src/components/Toast';
import BtnSubmit from 'src/components/BtnSubmit';
import { apiCreateMenuSubItem, apiUpdateMenuSubItem } from 'src/services/menuSubItem';


// Aminasi transisi
const Transition = forwardRef(function Transition(props, ref) {
  return (<Zoom ref={ref} {...props} />);
});


// Main component
const MenuSubItemForm = (props) => {
  const isMounted = useRef(true);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = React.useState({ show: false, type: null, message: '' });


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
  const getValidationSchema = (value) => {
    return Yup.object().shape({
      menu_item: Yup.string().required('Menu item is required'),
      title: Yup.string().max(128).required('Title is required'),
      url: Yup.string().max(128).required('Url is required'),
    });
  };


  // submit form
  const handleSubmitForm = async (data, { setErrors }) => {
    setLoading(true);
    try {
      let res = props.type === 'Create' ? await apiCreateMenuSubItem(data) : await apiUpdateMenuSubItem(props.data.id, data)
      setToast({ show: true, type: 'success', message: res.data.message });
      props.reloadTable();
      props.closeDialog();
    }
    catch (err) {
      err.status === 401 && logout();
      err.status === 422 && setErrors(err.data.errors);
      setToast({
        show: true,
        type: 'error',
        message: `#${err.status} ${err.statusText}`
      });
    }
    setLoading(false);
  };


  return (
    <>
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        maxWidth='lg'
        fullWidth={true}
        aria-labelledby='dialog-form-create'
      >
        <DialogTitle>{props.type + ' menu sub item'}</DialogTitle>

        <Formik
          initialValues={{
            menu_item: props.type === 'Update' ? props.data.menu_item_id : '',
            title: props.type === 'Update' ? props.data.menu_s_i_title : '',
            url: props.type === 'Update' ? props.data.menu_s_i_url : ''
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
                    <Grid item xs={12} >
                      <FormControl
                        required
                        fullWidth
                        variant='outlined'
                        disabled={loading}
                        error={Boolean(touched.menu_item && errors.menu_item)}
                      >
                        <InputLabel id='menu-item'>Menu Item</InputLabel>
                        <Select
                          labelId='menu-item'
                          name='menu_item'
                          label='Menu Item *'
                          value={values.menu_item}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <MenuItem value='' disabled><em>None</em></MenuItem>
                          {props.menuItems.map((data, key) => (
                            <MenuItem key={key} value={data.id}>{data.menu_i_title}</MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{touched.menu_item && errors.menu_item}</FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        required
                        disabled={loading}
                        label='Title'
                        name='title'
                        type='text'
                        variant='outlined'
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.title}
                        helperText={touched.title && errors.title}
                        error={Boolean(touched.title && errors.title)}
                      />
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        required
                        disabled={loading}
                        label='Url'
                        name='url'
                        type='text'
                        variant='outlined'
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.url}
                        helperText={touched.url && errors.url}
                        error={Boolean(touched.url && errors.url)}
                      />
                    </Grid>
                  </Grid>

                </DialogContent>

                <DialogActions>
                  <BtnSubmit
                    title={props.type}
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
}

export default MenuSubItemForm;