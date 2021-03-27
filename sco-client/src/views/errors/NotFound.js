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
import notFoundImage from 'src/assets/images/svg/404.svg';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    minHeight: '93vh'
  },
  image: {
    marginTop: 50,
    display: 'inline-block',
    maxWidth: '100%',
    width: 560
  }
}));

const NotFound = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Page title="Not Found" style={{ border: '5px solid green' }}>
      <Box className={classes.root}>
        <Container maxWidth="md">
          <Typography align="center" color="textPrimary" variant="h5">
            404: The page you are looking for isn’t here
          </Typography>

          <Typography align="center" color="textPrimary" variant="subtitle2">
            You either tried some shady route or you came here by mistake.
            Whichever it is, try using the navigation
          </Typography>

          <Box textAlign="center">
            <img alt="404" className={classes.image} src={notFoundImage} />

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

export default NotFound;
