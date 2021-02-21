import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import BtnSubmit from 'src/components/BtnSubmit';

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
  return (
    <Dialog
      open={open}
      onClose={() => onClose(loading)}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Alert severity="error">
          <Box ml={3}>
            {contentText === null ? (
              <ul>
                <li>Are you sure you want to permanently delete this data ?</li>
                <li>
                  All data related to this data will also be permanently
                  deleted.
                </li>
                <li>Deleted data cannot be recovered.</li>
              </ul>
            ) : (
              contentText
            )}
          </Box>
        </Alert>
      </DialogContent>

      <DialogActions>
        <BtnSubmit
          title="Delete"
          color="primary"
          loading={loading}
          handleSubmit={onDelete}
          handleCancel={() => onClose(loading)}
          variant="contained"
          size="small"
        />
      </DialogActions>
    </Dialog>
  );
}

/**
 * Default props
 */
DialogDelete.defaultProps = {
  open: false,
  loading: false,
  title: 'Delete',
  contentText: null,
  onDelete: () => {},
  onClose: () => {}
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
  contentText: PropTypes.string
};

export default DialogDelete;
