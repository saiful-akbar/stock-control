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
  IconButton,
  Icon
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import { Alert, Autocomplete } from '@material-ui/lab';
import Toast from 'src/components/Toast';
import BtnSubmit from 'src/components/BtnSubmit';
import materialIcons from 'src/components/MaterialIcons';
import {
  apiCreateMenuSubItem,
  apiUpdateMenuSubItem
} from 'src/services/menuSubItem';

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
  },
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18
    }
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
    window.location.href = '/logout';
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
        .required('Url is required'),
      icon: Yup.string()
        .max(128)
        .required('Icon is required')
    });
  };

  // submit form
  const handleSubmitForm = async (data, { setErrors }) => {
    setLoading(true);
    let res =
      props.type.toLowerCase() === 'create'
        ? await apiCreateMenuSubItem(data).catch(err => err)
        : await apiUpdateMenuSubItem(props.data.id, data).catch(err => err);

    if (res.status === 200) {
      setLoading(false);
      setToast({ show: true, type: 'success', message: res.data.message });
      props.reloadTable();
      props.closeDialog();
    } else if (res.status === 401) {
      logout();
    } else {
      if (res.status === 422) setErrors(res.data.errors);
      setLoading(false);
      setAlert({ type: 'error', message: res.data.message });
      setToast({
        show: true,
        type: 'error',
        message: `#${res.status} ${res.data.message}`
      });
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
        maxWidth="lg"
        scroll="paper"
        open={props.open}
      >
        <Formik
          initialValues={{
            menus:
              props.type.toLowerCase() === 'edit'
                ? props.data.menu_item_id
                : '',
            title:
              props.type.toLowerCase() === 'edit'
                ? props.data.menu_s_i_title
                : '',
            url:
              props.type.toLowerCase() === 'edit'
                ? props.data.menu_s_i_url
                : '',
            icon:
              props.type.toLowerCase() === 'edit'
                ? props.data.menu_s_i_icon
                : ''
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
            values,
            setFieldValue
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

              <DialogContent className={classes.content}>
                <form onSubmit={handleSubmit} autoComplete="off">
                  <Grid container spacing={2} mt={2} mb={2}>
                    <Grid item md={6} xs={12}>
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

                    <Grid item md={6} xs={12}>
                      <Autocomplete
                        autoHighlight
                        classes={{ option: classes.option }}
                        disabled={loading}
                        options={materialIcons}
                        getOptionLabel={option => option.label}
                        value={
                          values.icon === '' ? null : { label: values.icon }
                        }
                        getOptionSelected={(options, value) =>
                          Boolean(options.label === value.label)
                        }
                        onChange={(event, newValue) => {
                          if (newValue === null) {
                            setFieldValue('icon', values.icon);
                          } else {
                            setFieldValue('icon', newValue.label);
                          }
                        }}
                        renderOption={option => (
                          <React.Fragment>
                            <Icon>{option.class}</Icon>
                            {option.label}
                          </React.Fragment>
                        )}
                        renderInput={params => (
                          <TextField
                            {...params}
                            fullWidth
                            label="Icon"
                            variant="outlined"
                            error={Boolean(touched.icon && errors.icon)}
                            helperText={touched.icon && errors.icon}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  <button type="submit" style={{ display: 'none' }} />
                </form>
              </DialogContent>

              <DialogActions className={classes.actions}>
                <BtnSubmit
                  title={
                    props.type.toLowerCase() === 'edit' ? 'Update' : 'Create'
                  }
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
