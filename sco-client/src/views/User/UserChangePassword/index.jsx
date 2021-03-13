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
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import { useNavigate } from 'react-router';

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
  const isMounted = useRef(true);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmitForm = (data, { setErrors, resetForm }) => {
    setLoading(true);
    apiUpdateUserPassword(userId, data)
      .then(res => {
        if (isMounted.current) {
          props.setReduxToast({
            show: true,
            type: 'success',
            message: res.data.message
          });
          setLoading(false);
          resetForm();
          onClose();
        }
      })
      .catch(err => {
        if (isMounted.current) {
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

            case 422:
              setLoading(false);
              setErrors(err.data.errors);
              break;

            default:
              setLoading(false);
              props.setReduxToast({
                show: true,
                type: 'error',
                message: `(#${err.status}) ${err.data.message}`
              });
              break;
          }
        }
      });
  };

  return (
    <Dialog
      open={open}
      fullWidth={true}
      maxWidth="sm"
      aria-labelledby="form-dialog-title"
    >
      <Formik
        onSubmit={handleSubmitForm}
        initialValues={{
          password: ''
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string()
            .required()
            .max(200)
        })}
      >
        {({ errors, handleChange, handleSubmit, values }) => (
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

            <DialogContent className={classes.content}>
              <DialogContentText>
                {"Fill in the form below to change the user's password"}
              </DialogContentText>

              <FormControl
                fullWidth
                margin="dense"
                variant="outlined"
                error={Boolean(errors.password)}
              >
                <InputLabel id="label-password">New Password</InputLabel>
                <OutlinedInput
                  labelid="label-password"
                  label="New Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  disabled={loading}
                  value={values.password}
                  onChange={handleChange}
                  endAdornment={
                    values.password !== '' && (
                      <InputAdornment position="end">
                        <CustomTooltip
                          title={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                        >
                          <IconButton
                            color="primary"
                            size="small"
                            edge="end"
                            disabled={loading}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <VisibilityOffOutlinedIcon />
                            ) : (
                              <VisibilityOutlinedIcon />
                            )}
                          </IconButton>
                        </CustomTooltip>
                      </InputAdornment>
                    )
                  }
                />
                <FormHelperText>{errors.password}</FormHelperText>
              </FormControl>
            </DialogContent>

            <DialogActions className={classes.actions}>
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
    setReduxToast: value =>
      dispatch({
        type: reduxAction.toast,
        value: value
      })
  };
}

export default connect(null, reduxDispatch)(UserChangePassword);
