import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Avatar, useTheme } from '@material-ui/core';
import logoDark from 'src/assets/images/logo/logo-dark.png';
import logoLight from 'src/assets/images/logo/logo-light.png';

const useStyle = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0, 1),
    width: theme.spacing(5),
    height: theme.spacing(5)
  }
}));

const Logo = ({ reduxTheme, ...props }) => {
  const classes = useStyle();
  const theme = useTheme();

  return (
    <Avatar
      alt="Logo"
      src={theme.palette.type === 'dark' ? logoDark : logoLight}
      className={classes.root}
    />
  );
};

function reduxState(state) {
  return {
    reduxTheme: state.theme
  };
}

export default connect(reduxState, null)(Logo);
