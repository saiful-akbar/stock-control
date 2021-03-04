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

/* Style */
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

/* Custom dialog title */
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
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

/* Custom dialog content */
const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

/* Custom dialog actions */
const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.dark
  }
}))(MuiDialogActions);

/* Komponen utama */
function LogOut(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  /* Render */
  return (
    <React.Fragment>
      <Button
        fullWidth
        color="primary"
        size="small"
        variant="outlined"
        onClick={handleClickOpen}
      >
        {'Log Out'}
      </Button>

      <Dialog onClose={handleClose} maxWidth="xs" fullWidth={true} open={open}>
        <DialogTitle onClose={handleClose}>Log Out</DialogTitle>

        <DialogContent>
          <Typography gutterBottom>Are you sure you want to logout?</Typography>
        </DialogContent>

        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            onClick={() => (window.location.href = '/logout')}
            color="primary"
            variant="contained"
          >
            Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default LogOut;
