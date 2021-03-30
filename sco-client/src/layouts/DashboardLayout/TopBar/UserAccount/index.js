import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  ButtonBase,
  Box,
  Divider,
  Typography,
  ListItemIcon,
  ListItemText,
  Button
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import apiUrl from 'src/utils/apiUrl';
import { Skeleton } from '@material-ui/lab';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

/**
 * Style
 */
const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0, 0.5),
    display: 'flex'
  },
  paper: {
    marginRight: theme.spacing(2)
  },
  avatar: {
    borderRadius: '50%',
    width: theme.spacing(4),
    height: theme.spacing(4)
  },
  paperMenu: {
    width: theme.spacing(35)
  },
  paperAvatar: {
    marginBottom: theme.spacing(1),
    width: theme.spacing(12),
    height: theme.spacing(12),
    border: `5px solid ${theme.palette.background.dark}`,
    borderRadius: '50%'
  }
}));

/**
 * Komponen utama
 */
function UserAccount() {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const anchorRef = React.useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Redux
   */
  const { profile } = useSelector(state => state.authReducer.userLogin);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  /**
   * Handle close menu
   * @param {*} event
   */
  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  const handleLogout = e => {
    handleClose(e);
    dispatch({ type: 'SET_LOGOUT', value: true });
  };

  const handleGoTo = (event, path) => {
    handleClose(event);
    navigate(path);
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div className={classes.root}>
      {Boolean(profile) ? (
        <ButtonBase
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          className={classes.avatar}
          onClick={handleToggle}
        >
          <Avatar
            alt="Avatar"
            className={classes.avatar}
            src={
              Boolean(profile !== null)
                ? Boolean(profile.profile_avatar !== null)
                  ? apiUrl(`/avatar/${profile.profile_avatar}`)
                  : ''
                : ''
            }
          />
        </ButtonBase>
      ) : (
        <Skeleton variant="circle" className={classes.avatar} />
      )}

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom'
            }}
          >
            <Paper elevation={5} className={classes.paperMenu}>
              <ClickAwayListener onClickAway={handleClose}>
                <div>
                  <Box
                    p={2}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                  >
                    <Avatar
                      alt="Avatar"
                      className={classes.paperAvatar}
                      src={
                        Boolean(profile !== null)
                          ? Boolean(profile.profile_avatar !== null)
                            ? apiUrl(`/avatar/${profile.profile_avatar}`)
                            : ''
                          : ''
                      }
                    />

                    <Typography variant="body1" color="textPrimary" noWrap>
                      {Boolean(profile) ? profile.profile_name : '......'}
                    </Typography>

                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      noWrap
                    >
                      {Boolean(profile) ? profile.profile_division : '......'}
                    </Typography>
                  </Box>

                  <Divider />

                  <MenuList
                    id="menu-list-grow"
                    autoFocusItem={open}
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem onClick={e => handleGoTo(e, '/account')}>
                      <ListItemIcon>
                        <AccountCircleOutlinedIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Profile" />
                    </MenuItem>
                  </MenuList>

                  <Divider />

                  <Box
                    p={2}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                  >
                    <Button
                      color="primary"
                      variant="outlined"
                      onClick={e => handleLogout(e)}
                    >
                      Log out
                    </Button>
                  </Box>
                </div>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}

export default UserAccount;
