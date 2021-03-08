import React, { forwardRef } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100%',
    maxWidth: '100%',
    paddingTop: theme.spacing(2),
    flexGrow: 1
  }
}));

const Page = forwardRef(
  ({ children, title, pageTitle, reduxUserLogin, pb }, ref) => {
    const classes = useStyles();

    return (
      <div
        ref={ref}
        className={classes.root}
        style={{ paddingBottom: pb ? 90 : 30 }}
      >
        <Helmet>
          <title>SCO{Boolean(title) && ` - ${title}`}</title>
        </Helmet>

        <Container maxWidth={false}>
          {pageTitle !== null && (
            <Box
              mb={3}
              dispalay="flex"
              justifyContent="flex-start"
              alignItems="center"
            >
              {reduxUserLogin === null ? (
                <Skeleton variant="text">
                  <Typography variant="h5" color="textSecondary">
                    {pageTitle}
                  </Typography>
                </Skeleton>
              ) : (
                <Typography variant="h5" color="textSecondary">
                  {pageTitle}
                </Typography>
              )}
            </Box>
          )}

          {children}
        </Container>
      </div>
    );
  }
);

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  pageTitle: PropTypes.string,
  pb: PropTypes.bool
};

Page.defaultProps = {
  title: null,
  pageTitle: null,
  pb: false
};

const reduxState = state => ({
  reduxUserLogin: state.userLogin
});

export default connect(reduxState, null)(Page);
