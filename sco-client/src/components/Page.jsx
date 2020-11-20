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

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100%',
    maxWidth: '100%',
    paddingTop: theme.spacing(2),
    flexGrow: 1,
  },
  page: {
    color: theme.palette.text.secondary,
    paddingBottom: theme.spacing(2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1000,
    backgroundColor: theme.palette.type === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
  },
}));

const Page = forwardRef(({
  children,
  title,
  pageTitle,
  reduxLoading,
  pb,
}, ref) => {
  const classes = useStyles();

  return (
    <div
      ref={ref}
      className={classes.root}
      style={{ paddingBottom: pb ? 90 : 20 }}
    >
      <Helmet>
        <title>{`${Boolean(title) && `${title} - `}Stock Control`}</title>
      </Helmet>

      <Backdrop className={classes.backdrop} open={reduxLoading}>
        <CircularProgress color='primary' size={50} />
      </Backdrop>

      <Container maxWidth={false}>
        {pageTitle !== null && (
          <>
            <Grid container >
              <Grid item xs={12} >
                <Typography
                  className={classes.page}
                  variant='h6'
                >
                  {pageTitle}
                </Typography>
              </Grid>
            </Grid>
          </>
        )}

        <Animation
          type='fade'
          timeout={1000}
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
};

Page.defaultProps = {
  title: null,
  pageTitle: null,
}

const reduxState = (state) => ({
  reduxLoading: state.loading
});

export default connect(reduxState, null)(Page);
