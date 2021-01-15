import React, { forwardRef } from 'react';
import { Helmet } from 'react-helmet';
import {
  Container,
  Typography,
  Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100%',
    maxWidth: '100%',
    paddingTop: theme.spacing(2),
    flexGrow: 1,
  },
  pageTitle: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3),
  },
}));

const Page = forwardRef(({
  children,
  title,
  pageTitle,
  reduxUserLogin,
  pb,
}, ref) => {
  const classes = useStyles();

  return (
    <div
      ref={ref}
      className={classes.root}
      style={{ paddingBottom: pb ? 100 : 20 }}
    >
      <Helmet>
        <title>{Boolean(title) && `${title} - `}Stock Control</title>
      </Helmet>

      <Container maxWidth={false}>
        {pageTitle !== null && (
          <Box
            className={classes.pageTitle}
            dispalay='flex'
            justifyContent='flex-start'
            alignItems='center'
          >
            {reduxUserLogin === null
              ? (
                <Skeleton variant='text' >
                  <Typography variant='h5'>
                    {pageTitle}
                  </Typography>
                </Skeleton>
              ) : (
                <Typography variant='h5' >
                  {pageTitle}
                </Typography>
              )}
          </Box>
        )}
        {children}
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
  reduxUserLogin: state.userLogin,
});

export default connect(reduxState, null)(Page);
