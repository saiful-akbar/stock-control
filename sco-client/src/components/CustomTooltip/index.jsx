import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/styles';
import Tooltip from '@material-ui/core/Tooltip';

/* Style tooltip untuk mode gelap */
const Dark = withStyles(props => ({
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    boxShadow: '0 0 1px 0 rgba(0,0,0,0.31), 0 3px 4px -2px rgba(0,0,0,0.25)',
    color: '#fff',
    fontSize: 12,
    padding: 5
  }
}))(Tooltip);

/* Style tooltip untuk mode terang */
const Light = withStyles(props => ({
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    boxShadow: '0 0 1px 0 rgba(0,0,0,0.31), 0 3px 4px -2px rgba(0,0,0,0.25)',
    color: '#000',
    fontSize: 12,
    padding: 5
  }
}))(Tooltip);

/* Komponen utama */
const CustomTooltip = ({ dispatch, reduxTheme, children, ...rest }) => {
  const theme = useTheme();

  return theme.palette.type === 'dark' ? (
    <Light {...rest}>{children}</Light>
  ) : (
    <Dark {...rest}>{children}</Dark>
  );
};

export default CustomTooltip;
