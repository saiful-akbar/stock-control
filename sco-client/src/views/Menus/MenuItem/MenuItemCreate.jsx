import React from 'react';
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
} from '@material-ui/core';
import {
  apiCreateMenuItem
} from 'src/services/menuItem';
import Toast from 'src/components/Toast';
import BtnSubmit from 'src/components/BtnSubmit';
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


/* 
 * main component
 */
const MenuItemCreate = (props) => {
  const classes = useStyles();

  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState({ show: false, type: null, message: '' });
  const [values, setValues] = React.useState({
    title: '',
    url: '',
    icon: '',
    children: 0,
  });

  const [errors, setErrors] = React.useState({
    type: 'info',
    message: 'Fields marked with * are required',
    field: {}
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };
    let newValues = { ...values };
    newErrors[name] = `Field is required`;
    newValues[name] = value;
    if (value === '') {
      setErrors(newErrors);
    } else {
      newErrors[name] = '';
      setErrors(newErrors);
    }
    setValues(newValues);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };
    if (value === '') {
      newErrors[name] = `Field is required`;
      setErrors(newErrors);
    }
  };

  const resetValues = () => {
    setValues({
      title: '',
      url: '',
      icon: '',
      children: 0,
    });
    setErrors({
      type: 'info',
      message: 'Fields marked with * are required',
      field: {}
    });
  }

  const handleCloseDialog = () => {
    if (!loading) {
      props.close();
      resetValues();
    } else {
      return;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res = await apiCreateMenuItem(values);
      setToast({ show: true, type: 'success', message: res.data.message });
      setLoading(false);
      resetValues();
      props.reloadTable();
      props.close();
    }
    catch (err) {
      setLoading(false);
      if (err.status === 401) {
        window.location.href = '/logout';
      }
      else {
        setToast({
          show: true,
          type: 'error',
          message: `(#${err.status}) ${err.data.message}`
        });
        if (err.status === 422) {
          setErrors({
            type: 'error',
            message: err.data.message,
            field: { ...err.data.errors }
          });
        }
      }
    }
  };


  return (
    <>
      <Dialog
        fullWidth
        scroll='paper'
        maxWidth='md'
        open={props.open}
        onClose={handleCloseDialog}
      >

        <DialogTitle className={classes.header}>{'Create a new menu'}</DialogTitle>

        <Alert severity={errors.type}>
          {errors.message}
        </Alert>

        <DialogContent dividers>
          <form onSubmit={handleSubmit} autoComplete='off'>
            <Grid container spacing={2} mt={2} mb={2} >
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
                  helperText={errors.field.title}
                  onChange={handleChange}
                  value={values.title}
                  error={Boolean(errors.field.title)}
                />
              </Grid>

              <Grid item md={6} xs={12} >
                <TextField
                  fullWidth
                  required
                  name='url'
                  type='text'
                  variant='outlined'
                  label='Url'
                  disabled={loading}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.url}
                  error={Boolean(errors.field.url)}
                  helperText={errors.field.url}
                />
              </Grid>

              <Grid item md={6} xs={12} >
                <TextField
                  fullWidth
                  required
                  label='Icon'
                  name='icon'
                  type='text'
                  variant='outlined'
                  disabled={loading}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.icon}
                  error={Boolean(errors.field.icon)}
                  helperText={
                    Boolean(errors.field.icon)
                      ? errors.field.icon
                      : 'Use material design icons'
                  }
                />
              </Grid>

              <Grid item md={6} xs={12} >
                <FormControl
                  fullWidth
                  variant='outlined'
                  disabled={loading}
                  error={Boolean(errors.field.children)}
                >
                  <InputLabel id='children'>Children *</InputLabel>
                  <Select
                    required
                    labelId='children'
                    label='Children *'
                    name='children'
                    value={values.children}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <MenuItem value='1' >Yes</MenuItem>
                    <MenuItem value='0' >No</MenuItem>
                  </Select>
                  <FormHelperText>{errors.field.children}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            <button type='submit' style={{ display: 'none' }} />
          </form>
        </DialogContent>

        <DialogActions>
          <BtnSubmit
            title='Create'
            loading={loading}
            handleSubmit={handleSubmit}
            handleCancel={handleCloseDialog}
            variant='contained'
          />
        </DialogActions>
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

export default MenuItemCreate;
