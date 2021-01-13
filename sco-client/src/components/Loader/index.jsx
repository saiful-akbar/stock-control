import React from 'react';
import {
  makeStyles,
  CircularProgress,
  Backdrop,
} from '@material-ui/core';
import PropTypes from 'prop-types';


/**
 * Style
 */
const useStyles = makeStyles(theme => ({
  tableWrapper: {
    position: 'relative',
  },
  backdrop: {
    zIndex: 1000,
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.type === 'dark' ? 'rgba(19, 28, 33, 0.8)' : 'rgba(255, 255, 255, 0.8)',
  },
}));


/**
 * Komponent utama
 */
function Loader({ children, show, size, ...props }) {
  const classes = useStyles();


  /**
   * Render komponen
   */
  return (
    <div className={classes.tableWrapper}>
      <Backdrop
        className={classes.backdrop}
        open={show}
      >
        <CircularProgress color="primary" size={size} {...props} />
      </Backdrop>
      {children}
    </div>
  )
}


/**
 * Tipe props
 */
Loader.propTypes = {
  children: PropTypes.node.isRequired,
  show: PropTypes.bool,
};


/**
 * Default props
 */
Loader.defaultProps = {
  show: false,
  size: 50,
}

export default Loader;