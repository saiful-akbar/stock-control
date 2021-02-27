import React, { useRef, useEffect } from 'react';
import {
  Grid,
  TextField,
  CardContent,
  Divider,
  Box,
  Button,
  CardHeader,
  FormControlLabel,
  Checkbox,
  IconButton,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormHelperText,
  FormControl,
  Slide,
  Typography,
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { apiCekUserFrom } from 'src/services/user';
import CustomTooltip from 'src/components/CustomTooltip';
import { Skeleton } from '@material-ui/lab';


const UserForm = (props) => {
  const isMounted = useRef(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [transition, setTransition] = React.useState(true);

  const getValidationSchema = (value) => {
    return Yup.object().shape({
      username: Yup.string().max(128).required('Username is required'),
      password: Yup.string().max(128).required('Password is required'),
      is_active: Yup.boolean()
    });
  };

  useEffect(() => {
    return () => {
      isMounted.current = false;
      setTransition(false);
      props.setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  const handleSubmitForm = async (data, { setErrors }) => {
    props.setLoading(true);
    try {
      let res = await apiCekUserFrom(data);
      if (isMounted.current) {
        props.setData(res.data.form_data);
        props.setLoading(false);
        props.nextStep();

      }
    }
    catch (err) {
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
            message: `(#${err.status}) ${err.data.message}`
          });
        }
      }
    }
  }

  return (
    <Formik
      validationSchema={getValidationSchema}
      onSubmit={handleSubmitForm}
      initialValues={{
        username: props.data.username,
        password: props.data.password,
        is_active: props.data.is_active === '1' ? true : false,
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
          <form id='user-form' autoComplete='off' onSubmit={handleSubmit} noValidate >
            <CardHeader
              title={
                props.menus.menuItems.length === 0
                  ? <Skeleton variant='text' width='20%' />
                  : <Typography variant='h6'>{'User account'}</Typography>
              }
              subheader={
                props.menus.menuItems.length === 0
                  ? <Skeleton variant='text' width='30%' />
                  : 'Fields marked with * are required'
              }
            />

            <CardContent>
              <Slide direction="right" in={transition} timeout={300} mountOnEnter unmountOnExit>
                <Grid container spacing={3}>
                  <Grid item md={5} xs={12}>
                    {props.menus.menuItems.length === 0
                      ? (
                        <Skeleton variant='rect' height={54} />
                      ) : (
                        <TextField
                          fullWidth
                          required
                          name='username'
                          type='text'
                          variant='outlined'
                          label='Username'
                          disabled={props.loading}
                          value={values.username}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          helperText={touched.username && errors.username}
                          error={Boolean(touched.username && errors.username)}
                        />
                      )
                    }
                  </Grid>

                  <Grid item md={5} xs={12}>
                    {props.menus.menuItems.length === 0
                      ? (
                        <Skeleton variant='rect' height={54} />
                      ) : (
                        <FormControl
                          fullWidth
                          required
                          variant='outlined'
                          error={Boolean(touched.password && errors.password)}
                        >
                          <InputLabel id='label-password'>Password</InputLabel>
                          <OutlinedInput
                            labelid='label-password'
                            label='Password *'
                            id='password'
                            name='password'
                            type={showPassword ? 'text' : 'password'}
                            disabled={props.loading}
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
                          <FormHelperText>{touched.password && errors.password}</FormHelperText>
                        </FormControl>
                      )
                    }
                  </Grid>

                  <Grid item md={2} xs={12} >
                    {props.menus.menuItems.length === 0
                      ? (
                        <Skeleton variant='rect' height={54} />
                      ) : (
                        <FormControlLabel
                          label='Is Active'
                          control={
                            <Checkbox
                              checked={values.is_active}
                              name='is_active'
                              color='primary'
                              onChange={handleChange}
                              disabled={props.loading}
                            />
                          }
                        />
                      )
                    }
                  </Grid>
                </Grid>
              </Slide>
            </CardContent>

            <Divider />

            <Box
              display='flex'
              justifyContent='flex-end'
              p={2}
            >
              {props.menus.menuItems.length === 0
                ? (
                  <Skeleton variant='rect' width={93} height={36} />
                ) : (
                  <Button
                    color='primary'
                    variant='contained'
                    size='medium'
                    type='submit'
                    disabled={isSubmitting}
                    endIcon={<ArrowForwardIosIcon />}
                  >
                    {'Next'}
                  </Button>
                )
              }
            </Box>
          </form>
        )}
    </Formik>
  );
};

export default UserForm;