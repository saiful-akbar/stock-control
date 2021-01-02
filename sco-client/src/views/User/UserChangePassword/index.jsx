import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import BtnSubmit from 'src/components/BtnSubmit';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { apiUpdateUserPassword } from 'src/services/user';
import CustomTooltip from 'src/components/CustomTooltip';
import {
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel, OutlinedInput,
  FormHelperText,
  Zoom,
} from '@material-ui/core';


/**
 * Animasi transisi
 */
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});


/**
 * Komponen utama
 * @param {*} props 
 */
function UserChangePassword({ open, userId, onClose, onReloadTable, ...props }) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isMounted = useRef(true);


  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
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
          props.setReduxToast(true, 'error', `(#${err.status}) ${err.data.message}`);
        }
      }
    }
  };


  return (
    <Dialog
      TransitionComponent={Transition}
      open={open}
      onClose={handleClose}
      fullWidth={true}
      maxWidth='sm'
      aria-labelledby="form-dialog-title"
    >
      <Formik
        initialValues={{
          password: ''
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string().max(128).required('Password is required')
        })}
        onSubmit={handleSubmitForm}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          values,
        }) => (
            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
              <DialogTitle id="form-dialog-title">{'Change User Password'}</DialogTitle>

              <DialogContent>
                <DialogContentText>
                  {"Fill in the form below to change the user's password"}
                </DialogContentText>

                <FormControl
                  fullWidth
                  margin='dense'
                  variant='outlined'
                  error={Boolean(errors.password)}
                >
                  <InputLabel id='password'>New Password</InputLabel>
                  <OutlinedInput
                    labelid='password'
                    label='New Password'
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    disabled={isSubmitting}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    endAdornment={
                      values.password !== '' && (
                        <InputAdornment position='end'>
                          <CustomTooltip title={showPassword ? 'Hide Password' : 'Show Password'}>
                            <IconButton
                              color='primary'
                              size='small'
                              aria-label='toggle password visibility'
                              edge='end'
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
                  title='Update'
                  color='primary'
                  loading={loading}
                  handleSubmit={handleSubmit}
                  handleCancel={handleClose}
                  variant='contained'
                  size='small'
                />
              </DialogActions>
            </form>
          )}
      </Formik>
    </Dialog >
  );
}


/**
 * Tipe properti
 */
UserChangePassword.propTypes = {
  open: PropTypes.bool,
  userId: PropTypes.string,
  onClose: PropTypes.func,
  onReloadTable: PropTypes.func,
};


/**
 * properti default
 */
UserChangePassword.defaultProps = {
  open: false,
  userId: null,
  onClose: () => false,
  onReloadTable: () => false,
};



/**
 * Redux dispatch
 * @param {obj} dispatch 
 */
function reduxDispatch(dispatch) {
  return {
    setReduxToast: (
      show = false,
      type = 'success',
      message = ''
    ) => dispatch({
      type: reduxAction.toast,
      value: {
        show: show,
        type: type,
        message: message
      }
    }),
  }
}


export default connect(null, reduxDispatch)(UserChangePassword);