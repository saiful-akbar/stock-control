import React from 'react';
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
import { makeStyles, useTheme } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import { apiAddDocument, apiUpdateDocument } from 'src/services/document';
import Loader from 'src/components/Loader';
import { useNavigate } from 'react-router';
import addFileImage from 'src/assets/images/ilustration/add_file.svg';

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
    padding: theme.spacing(2)
  },
  inputFile: {
    border: `3px dashed ${theme.palette.divider}`,
    borderRadius: 5,
    cursor: 'pointer',
    padding: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center'
    },
    '&:hover': {
      opacity: 0.5
    }
  },
  inputFileError: {
    border: `3px dashed ${theme.palette.error.main}`,
    borderRadius: 5,
    cursor: 'pointer',
    padding: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center'
    }
  },
  image: {
    width: theme.spacing(15),
    height: theme.spacing(15)
  },
  buttonFile: {
    textAlign: 'center',
    marginTop: 20
  },
  actions: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.dark
  }
}));

/* Komponen utama */
function DocumentForm({
  open,
  type,
  data,
  onReloadTable,
  onClose,
  setReduxToast,
  ...props
}) {
  const isMounted = React.useRef(true);
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  /* State */
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState({
    type: 'info',
    message: 'Form with * is required'
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
      setAlert({
        type: 'info',
        message: 'Form with * is required'
      });
      onClose();
    }
  };

  /* Handle saat form di submit */
  const handleSubmitForm = async (values, { setErrors }) => {
    setLoading(true);

    setAlert({
      type: 'warning',
      message: "Processing... Don't leave or reload this page"
    });

    const formData = new FormData();
    formData.set('_method', Boolean(type === 'Add') ? 'POST' : 'PATCH');
    formData.set('document_file', values.document_file);
    formData.set('document_title', values.document_title);
    formData.set('document_description', values.document_description);

    try {
      let res = Boolean(type === 'Add')
        ? await apiAddDocument(formData)
        : await apiUpdateDocument(data.id, formData);

      if (isMounted.current) {
        setLoading(false);
        setReduxToast(true, 'success', res.data.message);
        onReloadTable(true);
        handleClose();
      }
    } catch (err) {
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

          case 422:
            setLoading(false);
            setErrors(err.data.errors);
            setAlert({
              type: 'error',
              message: err.data.message
            });
            break;

          default:
            setLoading(false);
            setAlert({
              type: 'error',
              message: err.data.message
            });
            break;
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
      open={open}
    >
      <Formik
        onSubmit={handleSubmitForm}
        validationSchema={validationSchema}
        initialValues={{
          document_file: '',
          document_title: Boolean(type === 'Edit' && data !== null)
            ? data.document_title
            : '',
          document_description: Boolean(type === 'Edit' && data !== null)
            ? data.document_description
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
              <Typography variant="h6">{`${type} document`}</Typography>
              <IconButton
                disabled={loading}
                className={classes.closeButton}
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <Alert severity={alert.type}>{alert.message}</Alert>

            <DialogContent>
              <Loader show={false}>
                <form
                  onSubmit={handleSubmit}
                  autoComplete="off"
                  noValidate
                  encType="multipart/form-data"
                >
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <label
                        htmlFor="file"
                        onDragOver={event => event.preventDefault()}
                        onDrop={event => {
                          event.preventDefault();
                          setFieldValue(
                            'document_file',
                            event.dataTransfer.files[0]
                          );
                        }}
                      >
                        <input
                          hidden
                          type="file"
                          id="file"
                          name="document_file"
                          accept=".xlsx,.xls,.csv,.pdf,.docx,.doc"
                          disabled={loading}
                          onChange={event => {
                            setFieldValue(
                              'document_file',
                              event.target.files[0]
                            );
                          }}
                        />
                        <Box
                          className={
                            Boolean(errors.document_file)
                              ? classes.inputFileError
                              : classes.inputFile
                          }
                        >
                          <Grid
                            spacing={3}
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                          >
                            <Grid item>
                              <img
                                alt="Add File"
                                src={addFileImage}
                                className={classes.image}
                              />
                            </Grid>

                            <Grid item zeroMinWidth>
                              <Typography variant="h6" noWrap>
                                {values.document_file === ''
                                  ? 'Select or drag files here'
                                  : values.document_file.name}
                              </Typography>

                              <Button
                                size="small"
                                variant="outlined"
                                color="default"
                                component="span"
                                className={classes.buttonFile}
                              >
                                {'Select files from your computer'}
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      </label>

                      <FormControl error={Boolean(errors.document_file)}>
                        <FormHelperText>
                          {Boolean(
                            !Boolean(errors.document_file) && type === 'Edit'
                          )
                            ? "Leave the document file fields blank if you don't want to change them"
                            : errors.document_file}
                        </FormHelperText>
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
              </Loader>
            </DialogContent>

            <DialogActions className={classes.actions}>
              <BtnSubmit
                variant="contained"
                title={type === 'Add' ? 'Add' : 'Update'}
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
  onReloadTable: () => {},
  onClose: () => {}
};

/* Redux reducer */
function reduxDispatch(dispatch) {
  return {
    setReduxToast: (show, type, message) =>
      dispatch({
        type: 'SET_TOAST',
        value: {
          show: show,
          type: type,
          message: message
        }
      })
  };
}

export default connect(null, reduxDispatch)(DocumentForm);
