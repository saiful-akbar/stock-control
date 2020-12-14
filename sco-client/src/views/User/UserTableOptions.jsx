import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Typography,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';


// Componen utama
const UserTableOptions = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { state, userData } = props;


  /**
   * handle saat menu di klik
   * @param {obj} event
   */
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };


  /**
   * Handle close menu
   */
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };


  /**
   * Link menu akses
   */
  const handleChangeUserMenus = () => {
    handleCloseMenu();
    navigate(`/user/${userData.id}/menus`, {
      state: {
        ...state,
        profile: {
          ...userData
        }
      }
    });
  }


  /**
   * handle edit user
   */
  const handleEdit = () => {
    handleCloseMenu();
    navigate(`/user/${userData.id}/edit`, {
      state: {
        ...state,
        profile: {
          ...userData
        }
      }
    });
  }


  /**
   * Handle delete
   */
  const handleDelete = () => {
    props.onDelete();
    handleCloseMenu();
  }


  const handleChangePassword = () => {
    props.onChangePassword();
    handleCloseMenu();
  }


  /**
   * Render komponen utama
   */
  return (
    <>
      <IconButton onClick={handleClickMenu}>
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleCloseMenu}
      >
        {props.state !== null && props.state.update === 1 && (
          <MenuItem onClick={handleChangeUserMenus}>
            <Typography variant='inherit'>Change menu access</Typography>
          </MenuItem>
        )}

        {props.state !== null && props.state.update === 1 && (
          <MenuItem onClick={handleChangePassword}>
            <Typography variant='inherit'>Change password</Typography>
          </MenuItem>
        )}

        {props.state !== null && props.state.delete === 1 && (
          <MenuItem onClick={handleDelete}>
            <Typography variant='inherit'>Delete</Typography>
          </MenuItem>
        )}

        {props.state !== null && props.state.update === 1 && (
          <MenuItem onClick={handleEdit}>
            <Typography variant='inherit'>Edit</Typography>
          </MenuItem>
        )}

        <MenuItem onClick={handleCloseMenu}>
          <Typography variant='inherit'>View detail</Typography>
        </MenuItem>
      </Menu>
    </>
  )
};


export default UserTableOptions;