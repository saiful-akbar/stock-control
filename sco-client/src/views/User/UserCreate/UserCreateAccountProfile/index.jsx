import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Paper,
  TextField
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';

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

  /* State */
  const [loading, setLoading] = React.useState(false);

  /* Fungsi handle submit form */
  const handleSubmitForm = (data, { setErrors }) => {
    console.log(data);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  /* Render */
  return (
    <Formik
      onSubmit={handleSubmitForm}
      initialValues={{
        username: '',
        password: '',
        is_active: true,
        profile_avatar: '',
        profile_name: '',
        profile_division: '',
        profile_email: '',
        profile_phone: '',
        profile_address: ''
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string()
          .required()
          .max(10),
        password: Yup.string()
          .required()
          .max(200),
        is_active: Yup.boolean(),
        profile_avatar: Yup.mixed(),
        profile_name: Yup.string()
          .required()
          .max(100),
        profile_division: Yup.string().max(100),
        profile_email: Yup.string().max(100),
        profile_phone: Yup.number().max(13),
        profile_address: Yup.string().max(300)
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
        <Card elevation={3}>
          <CardHeader
            title="Account & Profile"
            subheader="Create new user account and profile data"
          />
          <CardContent>
            <form onSubmit={handleSubmit} autoComplete="off" novalidate>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper elevation={3} className={classes.alert}>
                    <Alert severity="info">
                      Fields marked with <strong>*</strong> are required
                    </Alert>
                  </Paper>
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    required
                    margin="dense"
                    label="Username"
                    name="username"
                    type="text"
                    variant="outlined"
                    disabled={loading}
                    value={values.username}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.username && errors.username)}
                    helperText={touched.username && errors.username}
                  />
                </Grid>
                <Grid item md={6} xs={12}></Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      )}
    </Formik>
  );
}

export default UserCreateAccountProfile;
