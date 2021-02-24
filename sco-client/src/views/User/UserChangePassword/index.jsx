import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import PropTypes from 'prop-types';
import BtnSubmit from 'src/components/BtnSubmit';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { apiUpdateUserPassword } from 'src/services/user';
import CustomTooltip from 'src/components/CustomTooltip';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

/* Style */
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

/**
 * Komponen utama
 * @param {*} props
 */
function UserChangePassword({
  open,
  userId,
  onClose,
  onReloadTable,
  ...props
}) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  /**
   * Fungsi untuk menutup dialog
   */
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleSubmitForm = async (data, { resetForm }) => {
    setLoading(true);
    try {
      let res = await apiUpdateUserPassword(userId, data);
      if (isMounted.current) {
        setLoading(false);
        resetForm();
        props.setReduxToast(true, 'success', res.data.message);
        onClose();
      }
    } catch (err) {
      if (isMounted.current) {
        if (err.status === 401) {
          window.location.href = '/logout';
        } else {
          setLoading(false);
          props.setReduxToast(
            true,
            'error',
            `(#${err.status}) ${err.data.message}`
          );
        }
      }
    }
  };

  return (
    <Dialog
      open={open}
      fullWidth={true}
      maxWidth="sm"
      aria-labelledby="form-dialog-title"
    >
      <Formik
        initialValues={{
          password: ''
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string()
            .max(128)
            .required('Password is required')
        })}
        onSubmit={handleSubmitForm}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          values
        }) => (
          <form onSubmit={handleSubmit} autoComplete="off" noValidate>
            <DialogTitle disableTypography className={classes.header}>
              <Typography variant="h6">{'Change User Password'}</Typography>
              <IconButton
                disabled={loading}
                className={classes.closeButton}
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent>
              <DialogContentText>
                {"Fill in the form below to change the user's password"}
              </DialogContentText>

              <FormControl
                fullWidth
                margin="dense"
                variant="outlined"
                error={Boolean(errors.password)}
              >
                <InputLabel id="password">New Password</InputLabel>
                <OutlinedInput
                  labelid="password"
                  label="New Password"
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  disabled={isSubmitting}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  endAdornment={
                    values.password !== '' && (
                      <InputAdornment position="end">
                        <CustomTooltip
                          title={
                            showPassword ? 'Hide Password' : 'Show Password'
                          }
                        >
                          <IconButton
                            color="primary"
                            size="small"
                            aria-label="toggle password visibility"
                            edge="end"
                            disabled={isSubmitting}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </CustomTooltip>
                      </InputAdornment>
                    )
                  }
                />
                <FormHelperText>{errors.password}</FormHelperText>
              </FormControl>
            </DialogContent>

            <DialogActions>
              <BtnSubmit
                title="Update"
                color="primary"
                loading={loading}
                handleSubmit={handleSubmit}
                handleCancel={handleClose}
                variant="contained"
                size="small"
              />
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
}

/**
 * Tipe properti
 */
UserChangePassword.propTypes = {
  open: PropTypes.bool,
  userId: PropTypes.string,
  onClose: PropTypes.func,
  onReloadTable: PropTypes.func
};

/**
 * properti default
 */
UserChangePassword.defaultProps = {
  open: false,
  userId: null,
  onClose: () => false,
  onReloadTable: () => false
};

/**
 * Redux dispatch
 * @param {obj} dispatch
 */
function reduxDispatch(dispatch) {
  return {
    setReduxToast: (show = false, type = 'success', message = '') =>
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

export default connect(null, reduxDispatch)(UserChangePassword);
