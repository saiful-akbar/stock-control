import React from 'react';
import { Grid, Container, Box } from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormEditAccount from './FormEditUserAccount';
import FormEditProfile from './FormEditUserProfile';
import { Skeleton } from '@material-ui/lab';
import BtnSubmit from 'src/components/BtnSubmit';
import { useSelector, useDispatch } from 'react-redux';
import { apiUpdateUserAccountProfile } from 'src/services/user';
import { useParams, useNavigate } from 'react-router';

/**
 * Komponen utama
 * @param {*} param0
 */
const UserEditAccountProfile = ({ isSkeletonShow }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  /**
   * State
   */
  const [loading, setLoading] = React.useState(false);

  /**
   * Redux state & dispatch
   */
  const dispatch = useDispatch();
  const { account, profile } = useSelector(
    state => state.usersReducer.userEdit
  );

  /**
   * Mengatasi jika komponen dilapas saat request api belum selesai
   */
  const isMounted = React.useRef(true);
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  /**
   * Skema validasi untuk form
   */
  const validationSchema = () => {
    return Yup.object().shape({
      username: Yup.string()
        .required()
        .max(100),
      password: Yup.string()
        .max(200)
        .min(6),
      is_active: Yup.boolean().required(),
      name: Yup.string()
        .required()
        .max(100),
      avatar: Yup.mixed(),
      division: Yup.string()
        .required()
        .max(100),
      email: Yup.string().max(200),
      phone: Yup.number(),
      address: Yup.string().max(400)
    });
  };

  /**
   * Fungsi submit form
   */
  const handleSubmitForm = (data, { setErrors }) => {
    setLoading(true);

    const formData = new FormData();
    formData.set('_method', 'patch');
    formData.set('username', data.username);
    formData.set('password', data.password);
    formData.set('is_active', data.is_active ? 1 : 0);
    formData.set('avatar', data.avatar);
    formData.set('name', data.name);
    formData.set('email', data.email);
    formData.set('phone', data.phone);
    formData.set('division', data.division);
    formData.set('address', data.address);

    dispatch(apiUpdateUserAccountProfile(id, formData))
      .then(res => {
        if (isMounted.current) setLoading(false);
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

            default:
              setLoading(false);
              if (err.status === 422) setErrors(err.data.errors);
              break;
          }
        }
      });
  };

  return (
    <Container maxWidth="md">
      <Formik
        enableReinitialize={true}
        onSubmit={handleSubmitForm}
        validationSchema={validationSchema}
        initialValues={{
          username: account.username,
          password: '',
          is_active: account.isActive === 1 ? true : false,
          avatar: profile.avatar !== null ? profile.avatar : '',
          name: profile.name !== null ? profile.name : '',
          division: profile.division !== null ? profile.division : '',
          email: profile.email !== null ? profile.email : '',
          phone: profile.phone !== null ? profile.phone : '',
          address: profile.address !== null ? profile.address : ''
        }}
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
          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormEditAccount
                  isSkeletonShow={isSkeletonShow}
                  loading={loading}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  touched={touched}
                  errors={errors}
                />
              </Grid>

              <Grid item xs={12}>
                <FormEditProfile
                  isSkeletonShow={isSkeletonShow}
                  loading={loading}
                  values={values}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                  touched={touched}
                  errors={errors}
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end">
                  {isSkeletonShow ? (
                    <React.Fragment>
                      <Skeleton
                        variant="rect"
                        width={82}
                        height={42}
                        style={{ marginRight: 10 }}
                      />
                      <Skeleton variant="rect" width={82} height={42} />
                    </React.Fragment>
                  ) : (
                    <BtnSubmit
                      title="Save"
                      titleCancel="Reset"
                      variant="contained"
                      type="submit"
                      size="large"
                      handleSubmit={handleSubmit}
                      handleCancel={resetForm}
                      disabled={loading}
                      loading={loading}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Container>
  );
};

/**
 * Default props
 */
UserEditAccountProfile.defaultProps = {
  isSkeletonShow: false
};

export default UserEditAccountProfile;
