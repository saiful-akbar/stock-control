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
    marginTop: 50,
    display: 'inline-block',
    maxWidth: '100%',
    width: 560
  },
}));

const NotFoundView = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    props.setReduxLoading(false);
  });

  return (
    <Page
      title='404 - Stock Control'
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Typography
          align="center"
          color="textPrimary"
          variant="h3"
          gutterBottom
        >
          404:Page Not Found
        </Typography>

        <Typography
          align="center"
          color="textPrimary"
          variant="subtitle2"
        >
          You either tried some shady route or you came here by mistake.
          Whichever it is, try using the navigation
          </Typography>

        <Box textAlign="center">
          <img
            alt="Under development"
            className={classes.image}
            src="/static/images/undraw_page_not_found_su7k.svg"
          />
        </Box>

        <Box textAlign="center" style={{ marginTop: 40 }}>
          <Button
            variant='contained'
            color='primary'
            size='large'
            onClick={() => navigate('/')}
          >Go Back</Button>
        </Box>
      </Box>
    </Page>
  );
};

const reduxDispatch = (dispatch) => ({
  setReduxLoading: value => dispatch({ type: reduxAction.loading, value: value })
})

export default connect(null, reduxDispatch)(NotFoundView);
