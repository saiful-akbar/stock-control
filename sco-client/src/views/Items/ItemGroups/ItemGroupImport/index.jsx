import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Box, useMediaQuery } from '@material-ui/core';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import { Alert } from '@material-ui/lab';
import Loader from 'src/components/Loader';
import { makeStyles, useTheme } from '@material-ui/styles';
import { apiImportItemGroup } from 'src/services/itemGroups';
import BtnSubmit from 'src/components/BtnSubmit';
import { useNavigate } from 'react-router';

// Style DialogTitle
const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

// Komponen custom dialog titla
const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
          color="inherit"
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

// Komponen dialog content
const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

// Komponen dialog actions
const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

// Style ItemGroupImport
const useStyles = makeStyles(theme => ({
  image: {
    width: '100%',
    height: '30vh',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto 100%'
  },
  boxInput: {
    cursor: 'pointer'
  }
}));

// Komponen utama
function ItemGroupImport({
  open,
  onClose,
  onReloadTable,
  setReduxToast,
  ...props
}) {
  const classes = useStyles();
  const isMounted = React.useRef(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  /**
   * State
   */
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [alert, setAlert] = React.useState({
    type: 'info',
    message: 'Import can only support files with the .xlsx or .xls extension.'
  });

  /**
   * Handle jika komponen dilepas saat request api belum selesai
   */
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  // Set alert saat dialog pertama kali dibuka
  React.useEffect(() => {
    if (open) {
    }
  }, [open]);

  // Handle close dialog
  const handleClose = e => {
    if (!loading) {
      setAlert({
        type: 'info',
        message:
          'Import can only support files with the .xlsx or .xls extension.'
      });
      setValue('');
      onClose();
    }
  };

  // Handle input change
  const handleChange = e => {
    const file = e.target.files[0];
    const xls = 'application/vnd.ms-excel';
    const xlsx =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    if (Boolean(file)) {
      if (file.type !== xlsx && file.type !== xls) {
        setAlert({
          type: 'error',
          message: 'The file must be a file of type xlsx or xls.'
        });
      } else if (Math.ceil(file.size / 1000) > 1000) {
        setAlert({
          type: 'error',
          message: 'The file may not be greater than 1000 kilobytes'
        });
      } else {
        setAlert({
          type: 'success',
          message: 'File ready to import'
        });
        setValue(file);
      }
    }
  };

  // Handle submit
  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setAlert({
      type: 'warning',
      message: 'Importing... Do not reload or leave this page.'
    });

    let formData = new FormData();
    formData.set('file', value);

    apiImportItemGroup(formData)
      .then(res => {
        if (isMounted.current) {
          setLoading(false);
          setReduxToast(true, 'success', res.data.message);
          onReloadTable();
          handleClose();
        }
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
              setAlert({
                type: 'error',
                message:
                  err.status === 422
                    ? err.data.errors.join('')
                    : [err.data.message]
              });
              break;
          }
        }
      });
  };

  const handleDrop = event => {
    event.preventDefault();
    setValue(event.dataTransfer.files[0]);
  };

  return (
    <Dialog
      fullWidth
      fullScreen={fullScreen}
      open={open}
      maxWidth="md"
      aria-labelledby="dialog-import-title"
    >
      <DialogTitle id="dialog-import-title" onClose={handleClose}>
        {'Import from excel'}
      </DialogTitle>

      <Alert severity={alert.type}>{alert.message}</Alert>

      <DialogContent
        dividers
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        <Loader show={loading}>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <label htmlFor="file">
              <input
                hidden
                type="file"
                name="file"
                id="file"
                accept=".xlsx,.xls"
                onChange={handleChange}
              />

              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100%"
                className={classes.boxInput}
              >
                <img
                  src="/static/images/svg/add_file.svg"
                  alt="Add File"
                  className={classes.image}
                />

                <Typography variant="h5" noWrap>
                  {value === '' ? 'Select or drag files' : value.name}
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
          </form>
        </Loader>
      </DialogContent>

      <DialogActions>
        <BtnSubmit
          variant="contained"
          title="Import now"
          disabled={Boolean(loading || value === '')}
          loading={loading}
          handleCancel={handleClose}
          handleSubmit={handleSubmit}
        />
      </DialogActions>
    </Dialog>
  );
}

// Default props ItemGroupImport
ItemGroupImport.defaultProps = {
  open: false,
  onClose: e => e.preventDefault(),
  onReloadTable: e => e.preventDefault()
};

// Redux reducer
function reduxReducer(dispatch) {
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

export default connect(null, reduxReducer)(ItemGroupImport);
