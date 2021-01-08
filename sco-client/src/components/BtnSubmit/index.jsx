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
  wrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
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
  singleButton,
  disabled,
  ...props
}) => {
  const classes = useStyles();

  return loading
    ? (
      <div className={classes.wrapper}>
        <Button
          disabled={true}
          color={color}
          size={size}
          {...props}
        >
          {'Processing...'}
        </Button>
        <CircularProgress size={24} className={classes.buttonProgress} />
      </div>
    ) : (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        {!singleButton && (
          <Button
            onClick={handleCancel}
            color={color}
            size={size}
            disabled={disabled}
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
          disabled={disabled}
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
  singleButton: false,
  disabled: false,
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