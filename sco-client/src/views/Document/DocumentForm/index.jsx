import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  useMediaQuery,
  Typography,
  IconButton,
  Box,
  Button,
  FormControl,
  FormHelperText
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import BtnSubmit from 'src/components/BtnSubmit';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import { makeStyles, useTheme } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import { apiAddDocument } from 'src/services/document';

/* Style ItemGroupImport */
const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  header: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.topBar,
    color: '#ffffff'
  },
  inputFile: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 5,
    cursor: 'pointer',
    padding: theme.spacing(4),
    '&:hover': {
      border: `1px solid ${theme.palette.type === 'dark' ? '#fff' : '#000'}`
    }
  },
  inputFileError: {
    border: `1px solid #F44336`,
    borderRadius: 5,
    cursor: 'pointer',
    padding: theme.spacing(4)
  },
  iconInput: {
    fontSize: 70
  },
  image: {
    width: '100%',
    height: '20vh',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto 100%'
  }
}));

/* Komponen utama */
function DocumentForm(props) {
  const isMounted = React.useRef(true);
  const navigate = useNavigate();
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  /* State */
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState({
    type: 'info',
    message: ['Form with * is required']
  });

  /* Skema validasi untuk form */
  const validationSchema = () => {
    return Yup.object().shape({
      document_title: Yup.string('The document title field must be a string.')
        .max(100, 'The document title may not be greater than 100 characters.')
        .required('The document title field is required.'),
      document_description: Yup.string(
        'The document description field must be a string.'
      )
        .required('document description name field is required.')
        .max(
          200,
          'The document description may not be greater than 200 characters.'
        )
    });
  };

  /* Handle jika komponen dilepas saat request api belum selesai */
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };

    // eslint-disable-next-line
  }, []);

  /* Handle close dialog */
  const handleClose = e => {
    if (!loading) {
      setAlert({ type: 'info', message: ['Form with * is required'] });
      props.onClose();
    } else {
      e.preventDefault();
    }
  };

  /* Handle saat form di submit */
  const handleSubmitForm = async (values, { setErrors }) => {
    setLoading(true);
    setAlert({
      type: 'warning',
      message: ['Importing...', 'Do not reload or leave this page.']
    });

    let formData = new FormData();
    formData.set('document_file', values.document_file);
    formData.set('document_title', values.document_title);
    formData.set('document_description', values.document_description);

    try {
      let res = await apiAddDocument(formData);

      if (isMounted.current) {
        console.log('success', res);

        setLoading(false);
      }
    } catch (err) {
      if (isMounted.current) {
        console.log('error', err);

        setLoading(false);
        if (err.status === 401) {
          window.location.href = '/logout';
        } else if (err.status === 403) {
          navigate('/error/forbidden');
        } else if (err.status === 404) {
          navigate('/error/notfound');
        } else if (err.status === 422) {
          setErrors(err.data.errors);
          setAlert({
            type: 'error',
            message: [err.data.message]
          });
        }
      }
    }
  };

  /* Render */
  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      scroll="paper"
      maxWidth="md"
      open={props.open}
    >
      <Formik
        onSubmit={handleSubmitForm}
        validationSchema={validationSchema}
        initialValues={{
          document_file: '',
          document_title:
            props.type === 'Edit' && props.data !== null
              ? props.data.item_g_code
              : '',
          document_description:
            props.type === 'Edit' && props.data !== null
              ? props.data.item_g_name
              : ''
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          touched,
          setFieldValue,
          values
        }) => (
          <React.Fragment>
            <DialogTitle disableTypography className={classes.header}>
              <Typography variant="h6">{`${props.type} document`}</Typography>
              <IconButton
                disabled={loading}
                className={classes.closeButton}
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <Alert severity={alert.type}>
              <Box ml={3}>
                <ul>
                  {alert.message.map((m, key) => (
                    <li key={key}>{m}</li>
                  ))}
                </ul>
              </Box>
            </Alert>

            <DialogContent dividers>
              <form
                onSubmit={handleSubmit}
                autoComplete="off"
                noValidate
                encType="multipart/form-data"
              >
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <label htmlFor="file">
                      <input
                        hidden
                        type="file"
                        name="document_file"
                        id="file"
                        onChange={event => {
                          setFieldValue('document_file', event.target.files[0]);
                        }}
                      />

                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        className={
                          Boolean(errors.document_file)
                            ? classes.inputFileError
                            : classes.inputFile
                        }
                      >
                        <img
                          src="/static/images/svg/add_file.svg"
                          alt="Add File"
                          className={classes.image}
                        />

                        <Typography variant="h6">
                          {values.document_file === ''
                            ? 'Select files'
                            : values.document_file.name}
                        </Typography>

                        <Button
                          size="small"
                          variant="outlined"
                          color="default"
                          component="span"
                          style={{
                            textAlign: 'center',
                            marginTop: 20
                          }}
                        >
                          {'Select files from your computer'}
                        </Button>
                      </Box>
                    </label>

                    <FormControl error={Boolean(errors.document_file)}>
                      <FormHelperText>{errors.document_file}</FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      type="text"
                      name="document_title"
                      id="document_title"
                      label="Documnet Title"
                      variant="outlined"
                      margin="dense"
                      disabled={loading}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.document_title}
                      error={Boolean(
                        touched.document_title && errors.document_title
                      )}
                      helperText={
                        touched.document_title && errors.document_title
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={3}
                      type="text"
                      name="document_description"
                      id="document_description"
                      label="Document Description"
                      variant="outlined"
                      margin="dense"
                      disabled={loading}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.document_description}
                      error={Boolean(
                        touched.document_description &&
                          errors.document_description
                      )}
                      helperText={
                        touched.document_description &&
                        errors.document_description
                      }
                    />
                  </Grid>
                </Grid>
              </form>
            </DialogContent>

            <DialogActions>
              <BtnSubmit
                variant="contained"
                title={props.type === 'Add' ? 'Add' : 'Update'}
                loading={loading}
                handleCancel={handleClose}
                handleSubmit={handleSubmit}
              />
            </DialogActions>
          </React.Fragment>
        )}
      </Formik>
    </Dialog>
  );
}

/* Default props untuk komponent DocumentForm */
DocumentForm.defaultProps = {
  data: null,
  open: false,
  type: 'Add',
  onReloadTable: e => e.preventDefault(),
  onClose: e => e.preventDefault()
};

/* Redux reducer */
function reduxDispatch(dispatch) {
  return {
    setReduxToast: (show, type, message) =>
      dispatch({
        type: reduxAction.toast,
        value: {
          show: show,
          type: type,
          message: message
        }
      })
  };
}

export default connect(null, reduxDispatch)(DocumentForm);
