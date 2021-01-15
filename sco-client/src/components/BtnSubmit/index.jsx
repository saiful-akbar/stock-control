import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  CircularProgress,
  Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


/**
 * Style
 */
const useStyles = makeStyles((theme) => ({
  buttonProgress: {
    marginRight: 10
  },
  btnCancel: {
    marginRight: 10
  },
}));


/**
 * Komponen utama
 * @param {*} param0 
 */
const BtnSubmit = ({
  title,
  loading,
  handleSubmit,
  handleCancel,
  titleCancel,
  size,
  color,
  disabled,
  singleButton,
  ...props
}) => {
  const classes = useStyles();


  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
    >
      {loading && (
        <CircularProgress size={22} className={classes.buttonProgress} />
      )}


      {!singleButton && (
        <Button
          onClick={handleCancel}
          color={color}
          size={size}
          disabled={Boolean(disabled || loading)}
          className={classes.btnCancel}
        >
          {titleCancel}
        </Button>
      )}

      <Button
        type='submit'
        onClick={handleSubmit}
        size={size}
        color={color}
        disabled={Boolean(disabled || loading)}
        {...props}
      >
        {title}
      </Button>
    </Box>
  )
};

/**
 * Deault props
 */
BtnSubmit.defaultProps = {
  title: 'Submit',
  titleCancel: 'Cancel',
  size: 'medium',
  color: 'primary',
  loading: false,
  disabled: false,
  singleButton: false,
  handleCancel: () => null,
  handleSubmit: () => null,
};


BtnSubmit.propsTypes = {
  title: PropTypes.string,
  titleCancel: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  singleButton: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleSubmit: PropTypes.func,
}

export default BtnSubmit;