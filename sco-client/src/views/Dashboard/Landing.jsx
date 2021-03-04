import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    transform: 'rotateY(180deg)',
    [theme.breakpoints.up('md')]: {
      height: theme.spacing(50),
      marginBottom: theme.spacing(5),
      backgroundImage: 'url(/static/images/svg/work_tim.svg)',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto 100%'
    }
  },
  landingBox: {
    transform: 'rotateY(180deg)',
    padding: theme.spacing(3, 2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  text: {
    textShadow: `0px 0px 3px ${theme.palette.type === 'dark' ? '#000' : '#fff'}`
  }
}));

const Landing = props => {
  const classes = useStyles();

  return (
    <div className={classes.root} {...props}>
      <Box className={classes.landingBox}>
        <Typography className={classes.text} variant="h4" color="textPrimary">
          <strong>Dashboard</strong>.
        </Typography>

        <Typography className={classes.text} variant="h5" color="textSecondary">
          Welcome to <strong>Stock Control Aplication</strong>
        </Typography>
      </Box>
    </div>
  );
};

export default Landing;
