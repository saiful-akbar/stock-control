import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  LinearProgress,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Divider
} from '@material-ui/core';
import {
  makeStyles,
} from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import BtnSubmit from 'src/components/BtnSubmit';
import { Skeleton } from '@material-ui/lab';
import { apiEditUserAccount, apiUpdateUserAccount } from 'src/services/user';
import CustomTooltip from 'src/components/CustomTooltip';


/**
 * Style untuk komponen UserEditAccount
 */
const userEditProfileStyle = makeStyles((theme) => ({
  progress: {
    width: '100%',
    height: 4,
  },
}));


/**
 * Komponen utama
 * @param {*} props 
 */
function UserEditAccount({ userId, setReduxToast, reduxTheme, ...props }) {
  const classes = userEditProfileStyle();
  const isMounted = React.useRef(true);


  /**
   * State
   */
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);


  React.useEffect(() => {
    userData === null && getUserData();
    return () => {
      isMounted.current = false;
    }
    // eslint-disable-next-line
  }, []);


  /**
   * Fungsi untuk mengambil data profile user
   */
  const getUserData = async () => {
    try {
      let res = await apiEditUserAccount(userId);
      if (isMounted.current) {
        setUserData(res.data.user_data);
      }
    } catch (err) {
      if (isMounted.current) {
        if (err.status === 401) {
          window.location.href = '/logout';
        } else {
          setReduxToast(true, 'error', `(#${err.status}) ${err.data.message}`);
        }
      }
    }
  }


  /**
   * Fungsi untuk menghandle submit form
   * @param {obj|request form} data 
   * @param {obj} param1 
   */
  const handleSubmitForm = async (data, { setErrors }) => {
    setLoading(true);
    try {
      let res = await apiUpdateUserAccount(userId, data);
      if (isMounted.current) {
        setLoading(false);
        setReduxToast(true, 'success', res.data.message);
        setUserData(res.data.user_data);
      }
    } catch (err) {
      if (isMounted.current) {
        setLoading(false);
        if (err.status === 401) {
          window.location.href = 'logout';
        } else {
          err.status === 422 && setErrors(err.data.errors);
          setReduxToast(true, 'error', `(#${err.status}) ${err.data.message}`);
        }
      }
    }
  }


  /**
   * Render komponen utama
   */
  return (
    <Formik
      enableReinitialize={true}

      initialValues={{
        username: userData !== null ? userData.username : '',
        password: '',
        is_active: userData !== null && userData.is_active === 1 ? true : false,
      }}

      validationSchema={Yup.object().shape({
        username: Yup.string().required().max(128),
        password: Yup.string().min(4),
        is_active: Yup.boolean(),
      })}

      onSubmit={handleSubmitForm}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        touched,
        values,
        resetForm
      }) => (
          <form id='edit-user-account' autoComplete='off' onSubmit={handleSubmit} noValidate>
            <Card
              elevation={3}
              variant={
                reduxTheme === 'dark'
                  ? 'outlined'
                  : 'elevation'
              }
            >
              {loading
                ? <LinearProgress className={classes.progress} />
                : <div className={classes.progress} />
              }

              <CardHeader
                title={
                  userData === null
                    ? <Skeleton variant='text' width='10%' />
                    : 'Account'
                }
                subheader={
                  userData === null
                    ? <Skeleton variant='text' width='30%' />
                    : 'Change the account for user authentication'
                }
              />

              <CardContent>
                <Grid container spacing={3} >
                  <Grid item md={5} xs={12}>
                    {userData === null
                      ? (
                        <Skeleton variant='rect' width='100%' height={55} />
                      ) : (
                        <TextField
                          fullWidth
                          name="username"
                          label="Username"
                          type="text"
                          variant="outlined"
                          disabled={loading}
                          value={values.username}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.username && errors.username)}
                          helperText={touched.username && errors.username}
                        />
                      )}
                  </Grid>

                  <Grid item md={5} xs={12}>
                    {userData === null
                      ? (
                        <Skeleton variant='rect' width='100%' height={55} />
                      ) : (
                        <FormControl
                          fullWidth
                          variant='outlined'
                          error={Boolean(touched.password && errors.password)}
                        >
                          <InputLabel id='label-password'>{'Password'}</InputLabel>
                          <OutlinedInput
                            labelid='label-password'
                            label='Password'
                            id='password'
                            name='password'
                            type={showPassword ? 'text' : 'password'}
                            disabled={loading}
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            endAdornment={
                              values.password !== '' && (
                                <InputAdornment position='end'>
                                  <CustomTooltip title={showPassword ? 'Hide Password' : 'Show Password'}>
                                    <IconButton
                                      color='primary'
                                      aria-label='toggle password visibility'
                                      edge='end'
                                      disabled={props.loading}
                                      onClick={() => setShowPassword(!showPassword)}
                                      onMouseDown={e => e.preventDefault()}
                                    >
                                      {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </CustomTooltip>
                                </InputAdornment>
                              )
                            }
                          />
                          <FormHelperText>
                            {
                              Boolean(touched.password && errors.password)
                                ? touched.password && errors.password
                                : 'Please enter the password to change the old password or leave the password blank if you don\'t want to change it'
                            }
                          </FormHelperText>
                        </FormControl>
                      )}
                  </Grid>

                  <Grid item md={2} xs={12}>
                    {userData === null
                      ? (
                        <Skeleton variant='rect' width='100%' height={55} />
                      ) : (
                        <FormControlLabel
                          label='Is Active'
                          control={
                            <Checkbox
                              checked={values.is_active}
                              name='is_active'
                              color='primary'
                              onChange={handleChange}
                              disabled={loading}
                            />
                          }
                        />
                      )}
                  </Grid>
                </Grid>
              </CardContent>

              <Divider />

              <Box
                display='flex'
                justifyContent='flex-end'
                p={2}
              >
                {userData === null
                  ? (
                    <>
                      <Skeleton variant='rect' height={36} width={86} />
                      <Skeleton variant='rect' height={36} width={86} style={{ marginLeft: 10 }} />
                    </>
                  ) : (
                    <BtnSubmit
                      title='Update'
                      variant='contained'
                      type='submit'
                      handleSubmit={handleSubmit}
                      handleCancel={resetForm}
                      disabled={loading}
                      loading={loading}
                    />
                  )}
              </Box>
            </Card>
          </form>
        )}
    </Formik>
  )
}


/**
 * Tipe properti untuk komponen UserEditAccount
 */
UserEditAccount.propsTypes = {
  userId: PropTypes.string.isRequired,
};


/**
 * Redux state
 * @param {obj} state 
 */
function reduxState(state) {
  return {
    reduxTheme: state.theme
  }
}


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


export default connect(reduxState, reduxDispatch)(UserEditAccount);