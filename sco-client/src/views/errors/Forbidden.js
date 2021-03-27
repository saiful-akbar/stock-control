import React from 'react';
import {
  Box,
  Container,
  Typography,
  makeStyles,
  Button
} from '@material-ui/core';
import Page from 'src/components/Page';
import { useNavigate } from 'react-router-dom';
import warningImage from 'src/assets/images/svg/warning.svg';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    minHeight: '93vh'
  },
  image: {
    marginTop: 40,
    display: 'inline-block',
    maxWidth: '100%',
    width: 500
  }
}));

const Forbidden = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Page title="Not Found" style={{ border: '5px solid green' }}>
      <Box className={classes.root}>
        <Container maxWidth="md">
          <Typography align="center" color="textPrimary" variant="h5">
            403: Forbidden
          </Typography>

          <Box textAlign="center">
            <img alt="404" className={classes.image} src={warningImage} />

            <Box textAlign="center" pt={5}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/')}
              >
                Back to dashboard
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Page>
  );
};

export default Forbidden;
