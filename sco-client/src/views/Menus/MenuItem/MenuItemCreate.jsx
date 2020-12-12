import React from 'react';
import {
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
  InputLabel,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
  apiCreateMenuItem
} from 'src/services/menuItem';
import Toast from 'src/components/Toast';
import BtnSubmit from 'src/components/BtnSubmit';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


/* 
 * main component
 */
const MenuItemCreate = (props) => {
  const classes = useStyles();

  const [loading, setLoading] = React.useState(false);
  const [disableSubmit, setDisableSubmit] = React.useState(true);
  const [toast, setToast] = React.useState({ show: false, type: null, message: '' });
  const [values, setValues] = React.useState({
    title: '',
    url: '',
    icon: '',
    children: 0,
  });

  const [errors, setErrors] = React.useState({
    title: '',
    url: '',
    icon: '',
    children: ''
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

  React.useEffect(() => {
    if (values.title !== '' && values.url !== '' && values.icon !== '') {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  }, [values.title, values.url, values.icon]);

  const resetValues = () => {
    setValues({
      title: '',
      url: '',
      icon: '',
      children: 0,
    });
  }

  const handleCloseDialog = () => {
    props.close();
    resetValues();
    setErrors({
      title: '',
      url: '',
      icon: '',
      children: ''
    });
  }

  const handleSubmit = async () => {
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
          message: `(#${err.status}) ${err.statusText}`
        });
        if (err.status === 422) {
          const { errors } = err.data;
          setErrors({
            title: errors.title,
            url: errors.url,
            icon: errors.icon,
            children: errors.children
          });
        }
      }
    }
  };

  return (
    <>
      <Dialog
        fullScreen
        open={props.open}
        TransitionComponent={Transition}
        maxWidth='lg'
        scroll='paper'
        fullWidth={true}
        aria-labelledby='dialog-create-title'
      >
        <AppBar color='secondary' className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="close"
              onClick={handleCloseDialog}
              disabled={loading}
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h6" className={classes.title}>
              Create new menus
            </Typography>
          </Toolbar>
        </AppBar>

        <Alert severity='info'>
          {'Fields marked with * are required'}
        </Alert>

        <DialogContent dividers={true}>
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
                helperText={errors.title}
                onChange={handleChange}
                value={values.title}
                error={Boolean(errors.title)}
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
                helperText={errors.url}
                onChange={handleChange}
                value={values.url}
                error={Boolean(errors.url)}
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
                helperText={errors.icon}
                onChange={handleChange}
                value={values.icon}
                error={Boolean(errors.icon)}
              />
            </Grid>

            <Grid item md={6} xs={12} >
              <FormControl
                fullWidth
                variant='outlined'
                disabled={loading}
                error={Boolean(errors.children)}
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
                  <MenuItem value='1' >Yes</MenuItem>
                  <MenuItem value='0' >No</MenuItem>
                </Select>
                <FormHelperText>{errors.children}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <BtnSubmit
            title='Create'
            loading={loading}
            disabled={disableSubmit}
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
