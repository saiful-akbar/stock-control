import React from 'react';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  IconButton,
  Typography,
  Drawer,
  AppBar,
  Toolbar
} from '@material-ui/core';
import Appearance from './Appearance';
import CustomTooltip from 'src/components/CustomTooltip';
import settingImage from 'src/assets/images/svg/features.svg';

// Style
const useStyles = makeStyles(theme => ({
  root: {
    width: 450,
    overflow: 'hidden',
    fontWeight: 500,
    backgroundImage: `url(${settingImage})`,
    backgroundPosition: 'right 0 bottom 0',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% auto',
    [theme.breakpoints.down('xs')]: {
      width: '100vw'
    }
  },
  appBar: {
    backgroundColor: theme.palette.primary.dark
  },
  list: {
    width: '100%',
    height: 'calc(100% - 48px)',
    position: 'absolute',
    top: 48,
    overflowX: 'hidden',
    padding: theme.spacing(1),
    paddingTop: theme.spacing(2),
    zIndex: theme.zIndex.drawer + 1
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
      <AppBar position="static" elevation={3} className={classes.appBar}>
        <Toolbar variant="dense">
          <Typography variant="h6">Setting</Typography>

          <Box flexGrow={1} />

          <CustomTooltip title="Close setting">
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => onToggle(false)}
            >
              <CancelOutlinedIcon fontSize="small" />
            </IconButton>
          </CustomTooltip>
        </Toolbar>
      </AppBar>

      <Box className={classes.list}>
        <Appearance />
      </Box>
    </Drawer>
  );
}

export default NavSetting;
