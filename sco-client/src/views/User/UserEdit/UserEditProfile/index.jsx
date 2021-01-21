import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Grid,
  Avatar,
  Badge,
  Chip,
  TextField,
  Divider,
  LinearProgress,
  FormHelperText,
  FormControl,
} from '@material-ui/core';
import {
  makeStyles,
  withStyles
} from '@material-ui/core/styles';
import BtnSubmit from 'src/components/BtnSubmit';
import { apiEditUserProfile, apiUpdateUserProfile } from 'src/services/user';
import { reduxAction } from 'src/config/redux/state';
import apiUrl from 'src/utils/apiUrl';
import { Skeleton } from '@material-ui/lab';
import MaskedInput from 'react-text-mask';


/**
 * Small chip untuk avatar
 */
const SmallChip = withStyles((theme) => ({
  root: {
    border: `2px solid ${theme.palette.background.paper}`,
    cursor: 'pointer',
  },
}))(Chip);


/**
 * Component view avatar
 * @param {*} param0 
 */
function ViewAvatar({ file = '', ...props }) {
  const [thumb, setThumb] = React.useState('');

  React.useEffect(() => {
    if (typeof file === 'object') {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (e) => setThumb(e.target.result)
    }
    else if (typeof file === 'string' && file !== '') {
      setThumb(apiUrl(`/avatar/${file}`));
    }
  }, [file, setThumb]);

  return (
    <Badge
      overlap="circle"
      badgeContent={<SmallChip label="Edit" />}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <Avatar alt="Avatar" src={thumb} {...props} />
    </Badge>
  )
}



/**
 * Input text maks
 * @param {*} props 
 */
function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/[0-9]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      // placeholderChar={'\u2000'}
      showMask
    />
  );
}


/**
 * Style untuk komponen UserEditProfile
 */
const userEditProfileStyle = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(20),
    height: theme.spacing(20),
    cursor: 'pointer',
  },
  input: {
    display: 'none'
  },
  progress: {
    width: '100%',
    height: 4,
  },
}));


/**
 * Komponen utama
 * @param {*} props 
 */
function UserEditProfile({ userId, setReduxToast, reduxTheme, ...props }) {
  const classes = userEditProfileStyle();
  const isMounted = React.useRef(true);

  /**
   * State
   */
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);


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
      let res = await apiEditUserProfile(userId);
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

    let formData = new FormData();
    formData.set('_method', 'PATCH');
    formData.set('profile_avatar', data.profile_avatar);
    formData.set('profile_name', data.profile_name);
    formData.set('profile_email', data.profile_email);
    formData.set('profile_division', data.profile_division);
    formData.set('profile_phone', data.profile_phone);
    formData.set('profile_address', data.profile_address);

    try {
      let res = await apiUpdateUserProfile(userId, formData);
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
   * Fungsi untuk memvalidasi apakah profile avatar terdapat foto atau tidak
   * @param {obj} thumb 
   */
  const viewProfileAvatar = (thumb) => {
    if (thumb === '') {
      if (userData !== null && userData.profile_avatar !== null) {
        return userData.profile_avatar;
      }
    }
    return thumb;
  }



  return (
    <Formik
      enableReinitialize={true}

      initialValues={{
        profile_avatar: '',
        profile_name: userData !== null && userData.profile_name !== null ? userData.profile_name : '',
        profile_email: userData !== null && userData.profile_email !== null ? userData.profile_email : '',
        profile_division: userData !== null && userData.profile_division !== null ? userData.profile_division : '',
        profile_phone: userData !== null && userData.profile_phone !== null ? userData.profile_phone : '',
        profile_address: userData !== null && userData.profile_address !== null ? userData.profile_address : '',
      }}

      validationSchema={Yup.object().shape({
        profile_avatar: Yup.mixed(),
        profile_name: Yup.string().required('Full name is required').max(128, 'Too Long!'),
        profile_email: Yup.string().email('Invalid email').max(128, 'Too Long!'),
        profile_division: Yup.string().max(128, 'Too Long!'),
        profile_phone: Yup.string().max(15, 'Too Long!'),
        profile_address: Yup.string(),
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
        setFieldValue,
        resetForm
      }) => (
          <form encType="multipart/form-data" onSubmit={handleSubmit} noValidate autoComplete='off'>
            <Card
              variant={
                reduxTheme === 'dark'
                  ? 'outlined'
                  : 'elevation'
              }
              elevation={3}
            >
              {loading
                ? <LinearProgress className={classes.progress} />
                : <div className={classes.progress} />
              }

              <CardHeader
                title={
                  userData === null
                    ? <Skeleton variant='text' width='10%' />
                    : 'Profile'
                }
                subheader={
                  userData === null
                    ? <Skeleton variant='text' width='30%' />
                    : 'Fill in the form below to change user profile'
                }
              />

              <CardContent>
                <Grid container spacing={3} >
                  <Grid item xs={12} >
                    <Box
                      alignItems='center'
                      display='flex'
                      flexDirection='column'
                    >
                      {userData === null
                        ? (
                          <Skeleton variant="circle" className={classes.avatar} />
                        ) : (
                          <FormControl
                            error={Boolean(touched.profile_avatar && errors.profile_avatar)}
                            style={{ alignItems: 'center', }}
                          >
                            <input
                              type='file'
                              accept='image/*'
                              name='profile_avatar'
                              id='profile-avatar'
                              className={classes.input}
                              disabled={loading}
                              onChange={(event) => {
                                setFieldValue('profile_avatar', event.target.files[0]);
                              }}
                            />

                            <label htmlFor='profile-avatar' >
                              <ViewAvatar
                                id='avatar'
                                file={viewProfileAvatar(values.profile_avatar)}
                                className={classes.avatar}
                              />
                            </label>

                            <FormHelperText
                              style={{ textAlign: 'center' }}
                            >
                              {touched.profile_avatar && errors.profile_avatar}
                            </FormHelperText>
                          </FormControl>
                        )}
                    </Box>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    {userData === null
                      ? (
                        <Skeleton variant='rect' width='100%' height={55} />
                      ) : (
                        <TextField
                          fullWidth
                          name="profile_name"
                          label="Profile Name"
                          type="text"
                          variant="outlined"
                          disabled={loading}
                          value={values.profile_name}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.profile_name && errors.profile_name)}
                          helperText={touched.profile_name && errors.profile_name}
                        />
                      )}
                  </Grid>

                  <Grid item md={6} xs={12}>
                    {userData === null
                      ? (
                        <Skeleton variant='rect' width='100%' height={55} />
                      ) : (
                        <TextField
                          fullWidth
                          name="profile_email"
                          id="profile_email"
                          label="Profile Email"
                          type="email"
                          variant="outlined"
                          disabled={loading}
                          value={values.profile_email}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.profile_email && errors.profile_email)}
                          helperText={touched.profile_email && errors.profile_email}
                        />
                      )}
                  </Grid>

                  <Grid item md={6} xs={12}>
                    {userData === null
                      ? (
                        <Skeleton variant='rect' width='100%' height={55} />
                      ) : (
                        <TextField
                          fullWidth
                          name="profile_division"
                          id="profile_division"
                          label="Profile Division"
                          type="text"
                          variant="outlined"
                          disabled={loading}
                          value={values.profile_division}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.profile_division && errors.profile_division)}
                          helperText={touched.profile_division && errors.profile_division}
                        />
                      )}
                  </Grid>

                  <Grid item md={6} xs={12}>
                    {userData === null
                      ? (
                        <Skeleton variant='rect' width='100%' height={55} />
                      ) : (
                        <TextField
                          fullWidth
                          name="profile_phone"
                          id="profile_phone"
                          label="Profile Phone Number"
                          type="text"
                          variant="outlined"
                          disabled={loading}
                          value={values.profile_phone}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.profile_phone && errors.profile_phone)}
                          helperText={touched.profile_phone && errors.profile_phone}
                          InputProps={{
                            inputComponent: TextMaskCustom
                          }}
                        />
                      )}
                  </Grid>

                  <Grid item xs={12}>
                    {userData === null
                      ? (
                        <Skeleton variant='rect' width='100%' height={112} />
                      ) : (
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          name="profile_address"
                          id="profile_address"
                          label="Profile Address"
                          type="text"
                          variant="outlined"
                          disabled={loading}
                          value={values.profile_address}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          error={Boolean(touched.profile_address && errors.profile_address)}
                          helperText={touched.profile_address && errors.profile_address}
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
                      loading={loading}
                      disabled={loading}
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
 * Tipe properti untuk komponen UserEditProfile
 */
UserEditProfile.propsTypes = {
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


export default connect(reduxState, reduxDispatch)(UserEditProfile);