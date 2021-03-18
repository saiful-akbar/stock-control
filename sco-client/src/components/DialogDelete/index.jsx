import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import BtnSubmit from 'src/components/BtnSubmit';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';

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

/* Komponen utama */
function DialogDelete({
  open,
  onDelete,
  onClose,
  loading,
  title,
  contentText,
  buttonTitle,
  buttonVariant,
  buttonSize,
  buttonColor
}) {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={() => onClose(loading)}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle disableTypography className={classes.header}>
        <Typography variant="h6">{title}</Typography>
        <IconButton
          disabled={loading}
          className={classes.closeButton}
          onClick={() => onClose(loading)}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Alert severity="error">
          <AlertTitle>Danger</AlertTitle>
          {contentText === null ? (
            <ul>
              <li>Are you sure you want to permanently delete this data ?</li>
              <li>
                All data related to this data will also be permanently deleted.
              </li>
              <li>Deleted data cannot be recovered.</li>
            </ul>
          ) : (
            contentText
          )}
        </Alert>
      </DialogContent>

      <DialogActions className={classes.actions}>
        <BtnSubmit
          title={buttonTitle}
          color={buttonColor}
          variant={buttonVariant}
          size={buttonSize}
          loading={loading}
          handleSubmit={onDelete}
          handleCancel={() => onClose(loading)}
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
  buttonTitle: 'Delete',
  buttonVariant: 'contained',
  buttonSize: 'medium',
  buttonColor: 'primary',
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
  contentText: PropTypes.string,
  buttonTitle: PropTypes.string,
  buttonVariant: PropTypes.string,
  buttonSize: PropTypes.string,
  buttonColor: PropTypes.string
};

export default DialogDelete;
