import React, { forwardRef } from 'react';
import { Container, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100%',
    maxWidth: '100%',
    paddingTop: theme.spacing(2),
    flexGrow: 1
  }
}));

const Page = forwardRef(({ children, title, pageTitle, pb }, ref) => {
  const classes = useStyles();

  React.useEffect(() => {
    document.title = title === null ? 'Stock Control' : `SCO - ${title}`;
  }, [title]);

  return (
    <div
      ref={ref}
      className={classes.root}
      style={{ paddingBottom: pb ? 90 : 30 }}
    >
      {pageTitle !== null && (
        <Container>
          <Box mb={3}>
            <Typography variant="h5" color="textSecondary" noWrap>
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
