import React from 'react';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Zoom,
  IconButton
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import BtnSubmit from 'src/components/BtnSubmit';
import { apiTruncateTokens } from 'src/services/user';
import CustomTooltip from 'src/components/CustomTooltip';


// animasi
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});


// Komponen utama
function UserTruncateToken(props) {
  const isMounted = React.useRef(true);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState({
    type: 'error',
    message: 'Truncate all user tokens?'
  });


  // Ubah isMounted mendaji false ketika komponen dilepas
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    }
    // eslint-disable-next-line
  }, []);


  const handleSubmit = async () => {
    setLoading(true);
    try {
      let res = await apiTruncateTokens();
      if (isMounted.current) {
        setLoading(false);
        setAlert({ type: 'success', message: res.data.message });
      }
    }
    catch (err) {
      if (isMounted.current) {
        setLoading(false);
        if (err.status === 401) {
          window.location.href = 'logout';
        }
        else {
          setAlert({ type: 'error', message: err.data.message });
        }
      }
    }
  }


  return (
    <>
      <CustomTooltip title='Truncate user tokens'>
        <IconButton
          {...props}
          onClick={() => setOpen(true)}
        >
          <DeleteForeverIcon />
        </IconButton>
      </CustomTooltip>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        maxWidth='sm'
        fullWidth={true}
        aria-labelledby='dialog-truncate-title'
        aria-describedby='dialog-truncate-description'
      >
        <DialogTitle id='dialog-truncate-title'>
          {'Truncate user tokens'}
        </DialogTitle>

        <DialogContent>
          <Alert severity={alert.type}>
            <DialogContentText id='dialog-truncate-description'>
              {alert.message}
            </DialogContentText>
          </Alert>
        </DialogContent>

        <DialogActions>
          {alert.type === 'success'
            ? (
              <Button
                size='small'
                color='primary'
                onClick={() => window.location.href = '/logout'}
              >
                Please login again
              </Button>
            ) : (
              <BtnSubmit
                title='Truncate'
                color='secondary'
                variant='contained'
                size='small'
                loading={loading}
                handleSubmit={handleSubmit}
                handleCancel={() => {
                  setAlert({ type: 'error', message: 'Truncate all user tokens?' });
                  setOpen(false)
                }}
              />
            )
          }
        </DialogActions>
      </Dialog>
    </>
  )
}


export default UserTruncateToken;