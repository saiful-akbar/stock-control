import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';

import Toast from 'src/components/Toast';
import { Helmet } from 'react-helmet';
import { withCookies } from 'react-cookie';
import { login } from 'src/services/auth';
import { connect } from 'react-redux';
import CustomTooltip from 'src/components/CustomTooltip';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
        sco.feelbuy.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh',
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor: theme.palette.background.default,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%'
  },
  avatar: {
    marginBottom: theme.spacing(1),
    width: theme.spacing(10),
    height: theme.spacing(10)
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  buttonSubmit: {
    margin: theme.spacing(3, 0, 2)
  },
  paperForm: {
    backgroundColor:
      theme.palette.type === 'light'
        ? 'rgba(255, 255, 255, 0.8)'
        : 'rgba(0, 0, 0, 0.8)',
    padding: theme.spacing(4)
  }
}));

function LoginView({ cookies, loginUser, reduxTheme }) {
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [toast, setToast] = React.useState({
    show: false,
    type: null,
    message: ''
  });

  const classes = useStyles();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (cookies.get('auth_token') !== undefined) {
      navigate('/dashboard');
    }
    // eslint-disable-next-line
  }, []);

  const handleFormikSubmit = (data, { setErrors }) => {
    setLoading(true);
    loginUser(data)
      .then(res => {
        const date = new Date();
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
        cookies.set('auth_token', res.data.auth_token, {
          path: '/',
          expires: date
        });
        window.location.href = '/dashboard';
      })
      .catch(err => {
        Boolean(err.status === 422) && setErrors(err.data.errors);
        setLoading(false);
        setToast({
          show: true,
          type: 'error',
          message: `(#${err.status}) ${err.data.message}`
        });
      });
  };

  return (
    <div>
      <Helmet>
        <title>SCO - Login</title>
      </Helmet>

      <Grid
        container
        direction="row-reverse"
        justify="flex-start"
        component="main"
        className={classes.root}
      >
        <CssBaseline />

        <Grid
          item
          square
          xs={12}
          md={5}
          variant="outlined"
          component={Paper}
          className={classes.paperForm}
        >
          <div className={classes.paper}>
            <Avatar
              alt="Logo"
              src={`/static/images/logo/logo-${reduxTheme}-1.webp`}
              className={classes.avatar}
            />

            <Typography component="h1" variant="h5">
              Logged In
            </Typography>

            <Box mb={3}>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Login on the internal platform
              </Typography>
            </Box>

            <Formik
              onSubmit={handleFormikSubmit}
              initialValues={{ username: '', password: '' }}
              validationSchema={Yup.object().shape({
                username: Yup.string().required(),
                password: Yup.string().required()
              })}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                touched,
                values
              }) => (
                <form
                  noValidate
                  autoComplete="off"
                  className={classes.form}
                  onSubmit={handleSubmit}
                >
                  <TextField
                    fullWidth
                    label="Username"
                    margin="normal"
                    name="username"
                    type="text"
                    variant="outlined"
                    disabled={loading}
                    value={values.username}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    helperText={touched.username && errors.username}
                    error={Boolean(touched.username && errors.username)}
                  />

                  <FormControl
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={Boolean(touched.password && errors.password)}
                  >
                    <InputLabel htmlFor="password">{'Password'}</InputLabel>

                    <OutlinedInput
                      label="Password"
                      id="password"
                      name="password"
                      disabled={loading}
                      type={showPassword ? 'text' : 'password'}
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
                                edge="end"
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseDown={e => e.preventDefault()}
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </CustomTooltip>
                          </InputAdornment>
                        )
                      }
                    />

                    <FormHelperText>
                      {touched.password && errors.password}
                    </FormHelperText>
                  </FormControl>

                  <Box mt={3}>
                    <Button
                      fullWidth
                      size="large"
                      type="submit"
                      color="primary"
                      variant="contained"
                      disabled={loading}
                      className={classes.buttonSubmit}
                    >
                      {loading && (
                        <CircularProgress
                          color="inherit"
                          size={23}
                          style={{ marginRight: '10px' }}
                        />
                      )}

                      {loading ? 'Logged In...' : 'Login'}
                    </Button>

                    <Copyright />
                  </Box>
                </form>
              )}
            </Formik>
          </div>
        </Grid>
      </Grid>

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
    </div>
  );
}

function reduxDispatch(dispatch) {
  return {
    loginUser: data => dispatch(login(data))
  };
}

function reduxState(state) {
  return {
    reduxTheme: state.theme
  };
}

export default connect(reduxState, reduxDispatch)(withCookies(LoginView));
