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
    backgroundColor: theme.palette.type === 'dark' ? 'rgba(19, 28, 33, 0.9)' : 'rgba(255, 255, 255, 0.9)',
  },
}));


/**
 * Komponent utama
 */
function Loader({ children, show, ...props }) {
  const classes = useStyles();


  /**
   * Render komponen
   */
  return (
    <div className={classes.tableWrapper}>
      <Backdrop className={classes.backdrop} open={show}>
        <CircularProgress color="primary" size={50} />
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
}

export default Loader;