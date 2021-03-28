import React from 'react';
import { Box, Typography, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import landingImage from 'src/assets/images/svg/work_tim.svg';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    transform: 'rotateY(180deg)',
    marginBottom: theme.spacing(7),
    [theme.breakpoints.up('md')]: {
      height: theme.spacing(60),
      backgroundImage: `url(${landingImage})`,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'auto 100%'
    }
  },
  landingBox: {
    transform: 'rotateY(180deg)',
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
      <Container maxWidth="md">
        <Box className={classes.landingBox}>
          <Typography className={classes.text} variant="h4" color="textPrimary">
            <strong>Dashboard</strong>.
          </Typography>

          <Typography
            className={classes.text}
            variant="h6"
            color="textSecondary"
          >
            Welcome to <strong>Stock Control Aplication</strong>
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Landing;
