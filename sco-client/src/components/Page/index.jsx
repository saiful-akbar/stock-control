import React, { forwardRef } from 'react';
import { Helmet } from 'react-helmet';
import {
  Grid,
  Container,
  Typography,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Animation from 'src/components/Animation';
import { connect } from 'react-redux';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100%',
    maxWidth: '100%',
    paddingTop: theme.spacing(2),
    flexGrow: 1,
  },
  page: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 9999,
    backgroundColor: theme.palette.background.dark,
    // backgroundColor: theme.palette.type === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
  },
}));

const Page = forwardRef(({
  children,
  title,
  pageTitle,
  reduxLoading,
  reduxUserLogin,
  pb,
}, ref) => {
  const classes = useStyles();

  return (
    <div
      ref={ref}
      className={classes.root}
      style={{ paddingBottom: pb ? 90 : 10 }}
    >
      <Helmet>
        <title>{Boolean(title) && `${title} - `}Stock Control</title>
      </Helmet>

      <Backdrop className={classes.backdrop} open={reduxLoading}>
        <CircularProgress size={70} />
      </Backdrop>

      <Container maxWidth={false}>
        {pageTitle !== null && (
          <Grid container spacing={3}>
            <Grid item xs={12} >
              {reduxUserLogin === null
                ? (
                  <Skeleton variant='text' >
                    <Typography className={classes.page} variant='h5'>
                      {pageTitle}
                    </Typography>
                  </Skeleton>
                ) : (
                  <Typography className={classes.page} variant='h5' >
                    {pageTitle}
                  </Typography>
                )}
            </Grid>
          </Grid>
        )}

        <Animation
          type='fade'
          timeout={500}
          mountOnEnter
          unmountOnExit
        >
          {children}
        </Animation>
      </Container>


    </div>
  );
});

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  pageTitle: PropTypes.string,
  pb: PropTypes.bool,
};

Page.defaultProps = {
  title: null,
  pageTitle: null,
  pb: false,
}

const reduxState = (state) => ({
  reduxLoading: state.loading,
  reduxUserLogin: state.userLogin,
});

export default connect(reduxState, null)(Page);
