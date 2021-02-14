import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Avatar } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1),
    width: theme.spacing(5),
    height: theme.spacing(5)
  }
}));

const Logo = ({ reduxTheme, ...props }) => {
  const classes = useStyle();

  return (
    <Avatar
      alt="Logo"
      src={`/static/images/logo/logo-${reduxTheme}-1.webp`}
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
