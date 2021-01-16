import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  makeStyles,
  Button,
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import Page from 'src/components/Page';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';

const useStyles = makeStyles((theme) => ({
  image: {
    maxWidth: '100%',
    height: 350,
    width: 350
  },
}));

const NotFound = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    props.setReduxLoading(false);
  });

  return (
    <Page
      title='Not Found'
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >

        <img
          alt="Not Found"
          src="/static/images/svg/error-404.svg"
          className={classes.image}
        />

        <Box m={3}>
          <Typography
            align="center"
            color="textPrimary"
            variant="h6"
          >
            {'404 | Not Found'}
          </Typography>
        </Box>

        <Button
          color='default'
          size='large'
          variant='outlined'
          onClick={() => navigate('/')}
        >
          {'Go Back'}
        </Button>
      </Box>
    </Page>
  );
};

const reduxDispatch = (dispatch) => ({
  setReduxLoading: value => dispatch({ type: reduxAction.loading, value: value })
})

export default connect(null, reduxDispatch)(NotFound);