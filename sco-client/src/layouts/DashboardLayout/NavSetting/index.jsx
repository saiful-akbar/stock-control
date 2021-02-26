import React from 'react';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Divider,
  IconButton,
  Typography,
  Drawer
} from '@material-ui/core';
import Appearance from './Appearance';
import CustomTooltip from 'src/components/CustomTooltip';

// Style
const useStyles = makeStyles(theme => ({
  root: {
    width: 500,
    overflow: 'hidden',
    fontWeight: 500,
    [theme.breakpoints.down('xs')]: {
      width: '100vw'
    }
  },
  header: {
    padding: '8px 10px',
    // backgroundColor: theme.palette.background.topBar,
    color: '#FFFFFF'
  },
  list: {
    height: 'calc(100% - 80px)',
    overflowX: 'hidden',
    padding: '8px 10px'
  }
}));

// Komponen utama
function NavSetting({ onToggle, open, setReduxTheme, reduxTheme, ...props }) {
  const classes = useStyles();

  // Render
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => onToggle(false)}
      classes={{ paper: classes.root }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className={classes.header}
      >
        <Typography variant="h5" color="textPrimary">
          Setting
        </Typography>

        <CustomTooltip title="Close setting">
          <IconButton color="default" onClick={() => onToggle(false)}>
            <CancelOutlinedIcon />
          </IconButton>
        </CustomTooltip>
      </Box>

      <Divider />

      <Box className={classes.list}>
        <Appearance />
      </Box>
    </Drawer>
  );
}

export default NavSetting;