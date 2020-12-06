import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';

const CustomTooltip = ({
  dispatch,
  reduxTheme,
  children,
  ...rest
}) => {
  return reduxTheme === 'dark'
    ? (
      <Light {...rest}>{children}</Light>
    ) : (
      <Dark {...rest}>{children}</Dark>
    );
};

const Dark = withStyles((props) => ({
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    boxShadow: '0 0 1px 0 rgba(0,0,0,0.31), 0 3px 4px -2px rgba(0,0,0,0.25)',
    color: '#fff',
    fontSize: 11,
    padding: 5,
  }
}))(Tooltip);

const Light = withStyles((props) => ({
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 0 1px 0 rgba(0,0,0,0.31), 0 3px 4px -2px rgba(0,0,0,0.25)',
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: 11,
    padding: 5,
  }
}))(Tooltip);

const reduxState = (state) => ({
  reduxTheme: state.theme,
});

export default connect(reduxState, null)(CustomTooltip);
