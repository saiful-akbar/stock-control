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
import settingImage from 'src/assets/images/svg/settings.svg';

// Style
const useStyles = makeStyles(theme => ({
  root: {
    width: 450,
    overflow: 'hidden',
    fontWeight: 500,
    [theme.breakpoints.down('xs')]: {
      width: '100vw'
    }
  },
  header: {
    padding: theme.spacing(1)
  },
  img: {
    position: 'relative',
    zIndex: 1,
    height: 'calc(100% - 80px)',
    width: '100%',
    backgroundImage: `url(${settingImage})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto 250px'
    // opacity: '50%'
  },
  list: {
    width: '100%',
    height: 'calc(100% - 64px)',
    position: 'absolute',
    top: 64,
    zIndex: 2,
    overflowX: 'hidden',
    padding: theme.spacing(1)
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

      <div className={classes.img} />

      <Box className={classes.list}>
        <Appearance />
      </Box>
    </Drawer>
  );
}

export default NavSetting;
