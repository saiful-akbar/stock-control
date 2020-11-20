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
  const { state, userId } = props;


  /**
   * handle saat menu di klik
   * @param {event component} event
   */
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };


  // Handle close menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };


  // menu akses
  const handleChangeMenuAccess = () => {
    handleCloseMenu();
    navigate(`/user/${userId}/menuAccess`, { state: state });
  }


  // handle edit user
  const handleEdit = () => {
    handleCloseMenu();
    navigate(`/user/${userId}/edit`, { state: state });
  }


  // Handle delete
  const handleDelete = () => {
    props.openDialogDelete();
    handleCloseMenu();
  }



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
          <MenuItem onClick={handleChangeMenuAccess}>
            <Typography variant='inherit'>Change menu access</Typography>
          </MenuItem>
        )}

        {props.state !== null && props.state.update === 1 && (
          <MenuItem onClick={handleCloseMenu}>
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