import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Zoom,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import BtnSubmit from 'src/components/BtnSubmit';


/**
 * Animasi
 */
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});


/**
 * Komponen utama
 */
function DialogDelete({
  open,
  onDelete,
  onClose,
  loading,
  title,
  contentText,
  ...props
}) {

  /**
   * Render komponen utama
   */
  return (
    <Dialog
      open={open}
      onClose={() => onClose(loading)}
      TransitionComponent={Transition}
      maxWidth='sm'
      fullWidth={true}
      aria-labelledby='dialog-delete'
      elevation={3}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Alert severity="error">
          {contentText === ''
            ? (
              <div>
                <p>Are you sure you want to permanently delete this data ?</p>
                <p>Deleted data cannot be recovered.</p>
              </div>
            ) : (
              contentText
            )}
        </Alert>
      </DialogContent>

      <DialogActions>
        <BtnSubmit
          title='Delete'
          color='primary'
          loading={loading}
          handleSubmit={onDelete}
          handleCancel={() => onClose(loading)}
          variant='contained'
          size='small'
        />
      </DialogActions>
    </Dialog>
  )
}


/**
 * Default props
 */
DialogDelete.defaultProps = {
  open: false,
  onDelete: () => null,
  onClose: () => true,
  loading: false,
  title: 'Delete',
  contentText: '',
};


/**
 * Tipe props
 */
DialogDelete.propTypes = {
  open: PropTypes.bool,
  onDelete: PropTypes.func,
  onClose: PropTypes.func,
  loading: PropTypes.bool,
  title: PropTypes.string,
  contentText: PropTypes.string,
};


export default DialogDelete;