import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  CircularProgress,
} from '@material-ui/core';

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

  /**
   * button on proccess
   */
  const btnOnProcess = () => {
    return (
      <Button
        disabled={true}
        color={color}
        size={size}
      >
        <CircularProgress
          size={20}
          color='inherit'
          style={{ marginRight: 10 }}
        />
        {'Processing...'}
      </Button>
    );
  };

  /**
   * button active
   */
  const btnActive = () => {
    return (
      <>
        {!singleButton && (
          <Button
            onClick={handleCancel}
            color={color}
            size={size}
            disabled={disabled}
          >{titleCancel}</Button>
        )}

        <Button
          onClick={handleSubmit}
          size={size}
          color={color}
          disabled={disabled}
          {...props}
        > {title} </Button>
      </>
    );
  }

  return loading ? btnOnProcess() : btnActive();
};

/**
 * Deault props
 */
BtnSubmit.defaultProps = {
  title: '',
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