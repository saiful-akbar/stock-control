import React, { forwardRef } from 'react';
import { Container, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100%',
    maxWidth: '100%',
    paddingTop: theme.spacing(1),
    flexGrow: 1,
    overflowX: 'none'
  },
  pageTitle: {
    fontSize: 25,
    fontWeight: 500,
    color: theme.palette.text.primary
  }
}));

const Page = forwardRef(({ children, title, pageTitle, pb }, ref) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  React.useEffect(() => {
    document.title = title === null ? 'Stock Control' : `SCO - ${title}`;
    dispatch({
      type: 'SET_PAGE_TITLE',
      value: Boolean(pageTitle) ? pageTitle : 'Dashboard'
    });
  }, [title, pageTitle, dispatch]);

  return (
    <div
      ref={ref}
      className={classes.root}
      style={{ paddingBottom: pb ? 90 : 30 }}
    >
      {pageTitle !== null && (
        <Container maxWidth="lg">
          <Box mb={5}>
            <Typography variant="h5" noWrap className={classes.pageTitle}>
              {pageTitle}
            </Typography>
          </Box>
        </Container>
      )}

      {children}
    </div>
  );
});

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

export default Page;
