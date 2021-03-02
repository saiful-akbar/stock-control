import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Divider,
  Box
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormCreateAccount from './FormCreateAccount';
import BtnSubmit from 'src/components/BtnSubmit';

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

  /* State */
  const [loading, setLoading] = React.useState(false);

  /* Mengatasi jika komponen dilapas saat request api belum selesai */
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  /* Fungsi handle submit form */
  const handleSubmitForm = async (data, { setErrors }) => {
    console.log('Submitting', data);
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
          .max(200)
          .min(6),
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
        values,
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
                    <Alert severity="info">
                      Fields marked with <strong>*</strong> are required
                    </Alert>
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <FormCreateAccount
                    loading={loading}
                    values={values}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    touched={touched}
                    errors={errors}
                  />
                </Grid>
              </Grid>
            </CardContent>

            <Divider />

            <Box p={2} display="flex" justifyContent="flex-end">
              <BtnSubmit
                title="Save"
                variant="contained"
                type="submit"
                handleSubmit={handleSubmit}
                handleCancel={resetForm}
                disabled={loading}
                loading={loading}
              />
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
}

export default UserCreateAccountProfile;
