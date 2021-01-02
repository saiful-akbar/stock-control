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
    marginTop: '17%',
    display: 'inline-block',
    maxWidth: '100%',
    height: 350,
    width: 350,
    marginBottom: 20,
  },
}));

const Forbidden = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    props.setReduxLoading(false);
  });

  return (
    <Page
      title='Forbidden'
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >

        <Box textAlign="center">
          <img
            alt="NOT FOUND"
            src="/static/images/forbidden.svg"
            className={classes.image}
          />
          <Typography
            align="center"
            color="textPrimary"
            variant="h6"
          >
            {'403 | Forbidden'}
          </Typography>
        </Box>

        <Box textAlign="center" style={{ marginTop: 40 }}>
          <Button
            color='default'
            size='large'
            variant='outlined'
            onClick={() => navigate('/')}
          >
            {'Go Back'}
          </Button>
        </Box>
      </Box>
    </Page>
  );
};

const reduxDispatch = (dispatch) => ({
  setReduxLoading: value => dispatch({ type: reduxAction.loading, value: value })
})

export default connect(null, reduxDispatch)(Forbidden);
