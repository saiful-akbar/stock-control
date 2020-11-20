import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import {
  Grid,
  TextField,
  CardContent,
  Divider,
  Box,
  Button,
  CardHeader,
  Avatar,
  makeStyles,
  Slide,
  Typography
} from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { apiCekProfileFrom } from 'src/services/user';


// Style
const useStyle = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  input: {
    display: 'none'
  }
}));


// Main component
const ProfileForm = (props) => {
  const classes = useStyle();
  const isMounted = useRef(true);
  const [transition, setTransition] = React.useState(true);


  useEffect(() => {
    return () => {
      isMounted.current = false;
      setTransition(false);
      props.setLoading(false);
    }
    // eslint-disable-next-line
  }, []);


  // Handle submit form
  const handleSubmitForm = async (data, { setErrors }) => {
    props.setLoading(true);

    let newData = new FormData();
    newData.append('user_id', props.data.user_id);
    newData.append('profile_avatar', data.profile_avatar);
    newData.append('profile_name', data.profile_name);
    newData.append('profile_division', data.profile_division);
    newData.append('profile_email', data.profile_email);
    newData.append('profile_phone', data.profile_phone);
    newData.append('profile_address', data.profile_address);

    try {
      let res = await apiCekProfileFrom(newData)
      if (isMounted.current) {
        let response = { ...res.data.form_data };
        response['profile_avatar'] = data.profile_avatar;
        props.setData(response);
        props.setLoading(false);
        props.nextStep();
      }
    } catch (err) {
      if (isMounted.current) {
        props.setLoading(false);
        if (err.status === 401) {
          window.location.href = '/logout';
        }
        else {
          err.status === 422 && setErrors(err.data.errors);
          props.notification({
            show: true,
            type: 'error',
            message: `#${err.status} ${err.statusText}`
          });
        }
      }
    }
  }



  return (
    <Formik
      initialValues={{
        profile_avatar: props.data.profile_avatar,
        profile_name: props.data.profile_name,
        profile_division: props.data.profile_division,
        profile_email: props.data.profile_email,
        profile_phone: props.data.profile_phone,
        profile_address: props.data.profile_address,
      }}

      validationSchema={Yup.object().shape({
        profile_avatar: Yup.mixed(),
        profile_name: Yup.string().required('Field is a required').max(200),
        profile_division: Yup.string().max(128),
        profile_email: Yup.string().email('Field must be a valid email').max(200),
        profile_phone: Yup.string().max(15),
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
        isSubmitting
      }) => (
          <form onSubmit={handleSubmit} noValidate autoComplete='off' >
            <CardHeader
              title={<Typography variant='h6'>Profile</Typography>}
              subheader='Fields marked with * are required'
            />

            <CardContent>
              <Slide direction="right" in={transition} timeout={300} mountOnEnter unmountOnExit >
                <Grid
                  container
                  spacing={3}
                  direction='row'
                  justify='space-around'
                  alignItems='center'
                >
                  <Grid item xs={12} >
                    <Box
                      alignItems='center'
                      display='flex'
                      flexDirection='column'
                    >
                      <ViewAvatar
                        id='avatar'
                        file={values.profile_avatar}
                        className={classes.avatar}
                      />

                      <input
                        type='file'
                        accept='image/*'
                        id='profile-avatar'
                        name='profile_avatar'
                        className={classes.input}
                        disabled={props.loading}
                        onChange={(event) => {
                          setFieldValue('profile_avatar', event.target.files[0]);
                        }}
                      />

                      <label htmlFor='profile-avatar' style={{ marginTop: 5 }} >
                        <Button component='span' color='primary' disabled={props.loading}>Upload Avatar</Button>
                      </label>
                    </Box>
                  </Grid>

                  <Grid item md={6} xs={12} >
                    <TextField
                      fullWidth
                      required
                      name='profile_name'
                      type='text'
                      variant='outlined'
                      label='Full Name'
                      disabled={props.loading}
                      value={values.profile_name}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      helperText={touched.profile_name && errors.profile_name}
                      error={Boolean(touched.profile_name && errors.profile_name)}
                    />
                  </Grid>

                  <Grid item md={6} xs={12} >
                    <TextField
                      fullWidth
                      name='profile_division'
                      type='text'
                      variant='outlined'
                      label='Division'
                      disabled={props.loading}
                      value={values.profile_division}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      helperText={touched.profile_division && errors.profile_division}
                      error={Boolean(touched.profile_division && errors.profile_division)}
                    />
                  </Grid>

                  <Grid item md={6} xs={12} >
                    <TextField
                      fullWidth
                      name='profile_email'
                      type='text'
                      variant='outlined'
                      label='Email'
                      disabled={props.loading}
                      value={values.profile_email}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      helperText={touched.profile_email && errors.profile_email}
                      error={Boolean(touched.profile_email && errors.profile_email)}
                    />
                  </Grid>

                  <Grid item md={6} xs={12} >
                    <TextField
                      fullWidth
                      name='profile_phone'
                      type='text'
                      variant='outlined'
                      label='Phone Number'
                      disabled={props.loading}
                      value={values.profile_phone}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      helperText={touched.profile_phone && errors.profile_phone}
                      error={Boolean(touched.profile_phone && errors.profile_phone)}
                      InputProps={{
                        inputComponent: TextMaskCustom
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} >
                    <TextField
                      fullWidth
                      name='profile_address'
                      type='text'
                      variant='outlined'
                      label='Address'
                      multiline
                      rows={3}
                      disabled={props.loading}
                      value={values.profile_address}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      helperText={touched.profile_address && errors.profile_address}
                      error={Boolean(touched.profile_address && errors.profile_address)}
                    />
                  </Grid>
                </Grid>
              </Slide>
            </CardContent>
            <Divider />

            <Box display='flex' justifyContent='flex-end' p={2} >
              <Button
                color='primary'
                variant='outlined'
                type='button'
                style={{ marginRight: 20 }}
                onClick={props.backStep}
                disabled={props.loading}
                startIcon={<ArrowBackIosIcon />}
              >
                Back
              </Button>

              <Button
                color='primary'
                variant='contained'
                type='submit'
                disabled={isSubmitting}
                endIcon={<ArrowForwardIosIcon />}
              >
                Next
              </Button>
            </Box>
          </form>
        )}
    </Formik>
  );
};


// Component view avatar
function ViewAvatar({ file = '', ...props }) {
  const [thumb, setThumb] = React.useState('');

  React.useEffect(() => {
    if (file !== '') {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (e) => setThumb(e.target.result)
    }
  }, [file, setThumb]);

  return <Avatar
    src={thumb}
    {...props}
  />
}


// Input text maks
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

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

export default ProfileForm;