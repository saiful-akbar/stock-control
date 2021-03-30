import React from 'react';
import { Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import CustomTooltip from 'src/components/CustomTooltip';
import { useNavigate } from 'react-router-dom';

/**
 * Style untuk komponen UserEdit
 */
const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: theme.zIndex.appBar + 1
  }
}));

/**
 * Komponen utama
 *
 * @param mixed props
 *
 * @return [type]
 */
function FabReturn({ returnUrl, title }) {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleClick = e => {
    e.preventDefault();
    navigate(returnUrl);
  };

  /**
   * Render komponen utama
   */
  return (
    <div className={classes.fab}>
      <CustomTooltip title={title} placement="left">
        <Fab color="secondary" onClick={handleClick}>
          <RotateLeftIcon />
        </Fab>
      </CustomTooltip>
    </div>
  );
}

FabReturn.defaultProps = {
  returnUrl: '/',
  title: 'Return to the previous page'
};

export default FabReturn;
