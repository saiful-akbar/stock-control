import React from 'react';
import { Card, CardHeader } from '@material-ui/core';
import { Formik } from 'formik';
// import * as Yup from 'yup';

/* Komponent utama */
function UserCreateAccountProfile(props) {
  /* State */
  // const [loading, setLoading] = React.useState(false);

  /* Render */
  return (
    <Formik
      onSubmit={e => e.preventDefault()}
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
        </Card>
      )}
    </Formik>
  );
}

export default UserCreateAccountProfile;
