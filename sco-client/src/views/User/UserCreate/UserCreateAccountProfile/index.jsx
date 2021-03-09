import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Divider,
  Box
} from '@material-ui/core';
import { Alert, Skeleton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormCreateAccount from './FormCreateAccount';
import BtnSubmit from 'src/components/BtnSubmit';
import FormCreateProfile from './FormCreateProfile';
import { apiCreateUserAccountProfile } from 'src/services/user';
import { useNavigate } from 'react-router-dom';

/* Style */
const useStyles = makeStyles(theme => ({
  alert: {
    width: '100%',
    '& ul': {
      marginLeft: theme.spacing(2)
    }
  }
}));

/* Komponent utama */
function UserCreateAccountProfile(props) {
  const classes = useStyles();
  const isMounted = React.useRef(true);
  const navigate = useNavigate();

  /* State */
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState({
    type: 'info',
    message: 'Fields marked with * are required'
  });

  /* Mengatasi jika komponen dilapas saat request api belum selesai */
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  /* Fungsi handle submit form */
  const handleSubmitForm = (data, { setErrors }) => {
    setLoading(true);
    setAlert({
      type: 'warning',
      message: 'Processing... Do not reload or leave this page'
    });

    const newData = new FormData();
    newData.set('username', data.username);
    newData.set('password', data.password);
    newData.set('is_active', data.is_active ? 1 : 0);
    newData.set('avatar', data.avatar);
    newData.set('name', data.name);
    newData.set('email', data.email);
    newData.set('phone', data.phone);
    newData.set('division', data.division);
    newData.set('address', data.address);

    apiCreateUserAccountProfile(newData)
      .then(res => {
        if (isMounted.current) {
          setLoading(false);
          props.onChangeUserId(res.data.user_id);
          props.onNextStep();
        }
      })
      .catch(err => {
        if (isMounted.current) {
          setLoading(false);
          setAlert({
            type: 'error',
            message: `(#${err.status}) ${err.data.message}`
          });

          if (err.status === 422) {
            setErrors(err.data.errors);
          } else if (err.status === 401) {
            window.location.href = '/logout';
          } else if (err.status === 403) {
            navigate('/error/forbidden');
          }
        }
      });
  };

  /* Render */
  return (
    <Formik
      onSubmit={handleSubmitForm}
      initialValues={{
        username: '',
        password: '',
        is_active: true,
        avatar: '',
        name: '',
        division: '',
        email: '',
        phone: '',
        address: ''
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string()
          .required()
          .max(100),
        password: Yup.string()
          .required()
          .max(200)
          .min(6),
        is_active: Yup.boolean().required(),
        name: Yup.string()
          .required()
          .max(100),
        avatar: Yup.mixed(),
        division: Yup.string().max(100),
        email: Yup.string().max(200),
        phone: Yup.number(),
        address: Yup.string().max(400)
      })}
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
        <form onSubmit={handleSubmit} autoComplete="off" noValidate>
          <Card elevation={3}>
            <CardHeader
              title="Account & Profile"
              subheader="Create new user account and profile data"
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <div className={classes.alert}>
                    <Alert severity={alert.type}>{alert.message}</Alert>
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <FormCreateAccount
                    dataMenus={props.dataMenus}
                    loading={loading}
                    values={values}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    touched={touched}
                    errors={errors}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormCreateProfile
                    dataMenus={props.dataMenus}
                    loading={loading}
                    values={values}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    touched={touched}
                    errors={errors}
                  />
                </Grid>
              </Grid>
            </CardContent>

            <Divider />

            <Box p={2} display="flex" justifyContent="flex-end">
              {props.dataMenus === null ? (
                <>
                  <Skeleton
                    variant="rect"
                    width={68}
                    height={36}
                    style={{ marginRight: 10 }}
                  />
                  <Skeleton variant="rect" width={68} height={36} />
                </>
              ) : (
                <BtnSubmit
                  title="Save"
                  variant="contained"
                  type="submit"
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
  );
}

export default UserCreateAccountProfile;
