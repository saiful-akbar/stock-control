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
import { Box } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import { Alert } from '@material-ui/lab';
import Loader from 'src/components/Loader';
import { makeStyles } from '@material-ui/styles';


/* Style DialogTitle */
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    // color: theme.palette.grey[500],
  },
});


/* Komponen custom dialog titla */
const DialogTitle = withStyles(styles)((props) => {
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


/* Komponen dialog content */
const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);


/* Komponen dialog actions */
const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);


/* Style ItemGroupImport */
const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: theme.palette.background.topBar,
    color: '#ffffff',
  },
}));


/* Komponen utama */
function ItemGroupImport({
  open,
  onClose,
  setReduxToast,
  ...props
}) {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [alert, setAlert] = React.useState({
    type: "info",
    message: [
      "Import can only support files with the .xlsx, .xls, or .csv extension.",
      "The maximum size is 2000 kilobytes or 2 megabytes."
    ]
  });


  React.useEffect(() => {
    if (open) {
      setAlert({
        type: "info",
        message: [
          "Import can only support files with the .xlsx, .xls, or .csv extension.",
          "The maximum size is 2000 kilobytes."
        ]
      });
    }
  }, [open]);


  /* Handle close dialog */
  const handleClose = (e) => {
    if (!loading) {
      setValue("");
      onClose();
    } else {
      e.preventDefault();
    }
  }


  /* Handle input change */
  const handleChange = (e) => {
    const file = e.target.files[0];
    const xlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const xls = 'application/vnd.ms-excel';
    const csv = 'text/csv';
    if (file.type !== xlsx && file.type !== xls && file.type !== csv) {
      setAlert({
        type: "error",
        message: ["Unsupported file type"]
      });
    }
    else if (Math.ceil(file.size / 1000) > 2000) {
      setAlert({
        type: "error",
        message: ["File size exceeds 2000 kilobyte"]
      });
    }
    else {
      setValue(file);
    }
  }

  /* Handle submit */
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({
      type: "warning",
      message: [
        "Importing ...",
        "Do not reload or leave this page."
      ]
    });
    setTimeout(() => {
      setAlert({
        type: "success",
        message: ["Import was successful"]
      });
      setLoading(false);
    }, 10000);
  }


  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth="md"
      aria-labelledby="dialog-import-title"
    >

      <DialogTitle
        id="dialog-import-title"
        onClose={handleClose}
        className={classes.header}
      >
        {'Import from excel'}
      </DialogTitle>

      <Alert severity={alert.type} >
        <Box ml={3}>
          <ul>{alert.message.map((m, key) => <li key={key}>{m}</li>)}</ul>
        </Box>
      </Alert>

      <DialogContent dividers>
        <Loader show={loading}>
          <form onSubmit={handleSubmit} encType="multipart/form-data" >
            <input
              type="file"
              name="file"
              id="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleChange}
              style={{ display: "none" }}
            />

            <label htmlFor="file">
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                style={{ cursor: "pointer" }}
              >
                <FileCopyIcon
                  color="disabled"
                  style={{ fontSize: 150 }}
                />

                <Typography variant="h5">
                  {value === "" ? "Select files" : value.name}
                </Typography>

                <Button
                  size="small"
                  variant="outlined"
                  color="default"
                  component='span'
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={Boolean(value === "" || loading)}
        >
          {loading ? "importing..." : "Import now"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}


/* Default props ItemGroupImport */
ItemGroupImport.defaultProps = {
  open: false,
  onClose: (e) => e.preventDefault(),
};


/* Redux reducer */
function reduxReducer(dispatch) {
  return {
    setReduxToast: (show, type, message) => dispatch({
      type: reduxAction.toast,
      value: {
        show: show,
        type: type,
        message: message
      }
    })
  }
}


export default connect(null, reduxReducer)(ItemGroupImport);
