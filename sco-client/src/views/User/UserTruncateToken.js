import React from 'react';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import BtnSubmit from 'src/components/BtnSubmit';
import { apiTruncateTokens } from 'src/services/user';
import CustomTooltip from 'src/components/CustomTooltip';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import { useNavigate } from 'react-router';

/* Style */
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
  actions: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.dark
  }
}));

// Komponen utama
function UserTruncateToken(props) {
  const isMounted = React.useRef(true);
  const classes = useStyles();
  const navigate = useNavigate();

  /* State */
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState({
    type: 'error',
    message:
      'Delete all user tokens? After deleting all tokens requires all users to re-login'
  });

  /* Ubah isMounted mendaji false ketika komponen dilepas */
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  const handleSubmit = () => {
    setLoading(true);
    apiTruncateTokens()
      .then(res => {
        if (isMounted.current) {
          setLoading(false);
          setAlert({ type: 'success', message: res.data.message });
          setTimeout(() => {
            window.location.href = '/logout';
          }, 3000);
        }
      })
      .catch(err => {
        if (isMounted.current) {
          switch (err.status) {
            case 401:
              window.location.href = '/logout';
              break;

            case 403:
              navigate('error/forbidden');
              break;

            case 404:
              navigate('error/notfound');

              break;

            default:
              setLoading(false);
              setAlert({
                type: 'error',
                message: `(#${err.status}) ${err.data.message}`
              });
              break;
          }
        }
      });
  };

  /**
   * Fungsi menutup dialog
   */
  const handleClose = () => {
    if (!loading && alert.type !== 'success') {
      setAlert({
        type: 'error',
        message:
          'Delete all user tokens? After deleting all tokens requires all users to re-login'
      });
      setOpen(false);
    }
  };

  return (
    <>
      <CustomTooltip title="Truncate user tokens">
        <IconButton {...props} onClick={() => setOpen(true)}>
          <DeleteForeverOutlinedIcon />
        </IconButton>
      </CustomTooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
        <DialogTitle disableTypography className={classes.header}>
          <Typography variant="h6">{'Truncate user tokens'}</Typography>
          <IconButton
            disabled={loading}
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Alert severity={alert.type}>
            <AlertTitle>
              {alert.type === 'error' ? 'Danger' : alert.type}
            </AlertTitle>
            {alert.message}
          </Alert>
        </DialogContent>

        <DialogActions className={classes.actions}>
          {alert.type === 'success' ? (
            <Button
              size="small"
              color="primary"
              onClick={() => (window.location.href = '/logout')}
            >
              {'Please login again'}
            </Button>
          ) : (
            <BtnSubmit
              title="Delete"
              color="primary"
              variant="contained"
              loading={loading}
              handleSubmit={handleSubmit}
              handleCancel={handleClose}
            />
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UserTruncateToken;
