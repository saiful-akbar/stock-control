import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CustomTooltip from 'src/components/CustomTooltip';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';

// Componen utama
const UserTableOptions = ({
  userData,
  state,
  onDelete,
  onChangePassword,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  /**
   * handle saat menu di klik
   * @param {obj} event
   */
  const handleClickMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Handle close menu
   */
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  /**
   * handle edit user
   */
  const handleEdit = () => {
    handleCloseMenu();
    navigate(`/users/${userData.id}/edit`);
  };

  /**
   * Handle delete
   */
  const handleDelete = () => {
    onDelete();
    handleCloseMenu();
  };

  /**
   * Handle ubah password
   */
  const handleChangePassword = () => {
    onChangePassword();
    handleCloseMenu();
  };

  /**
   * handle view user
   */
  const handleViewDetails = () => {
    handleCloseMenu();
    navigate(`/users/${userData.id}`);
  };

  /**
   * Render komponen utama
   */
  return (
    <React.Fragment>
      <CustomTooltip placement="bottom" title="Options">
        <IconButton onClick={handleClickMenu}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </CustomTooltip>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleCloseMenu}
      >
        {state !== null && state.user_m_s_i_update === 1 && (
          <MenuItem onClick={handleChangePassword}>
            <ListItemIcon>
              <LockOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">{'Change password'}</Typography>
          </MenuItem>
        )}

        {state !== null && state.user_m_s_i_delete === 1 && (
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <DeleteOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">{'Delete'}</Typography>
          </MenuItem>
        )}

        {state !== null && state.user_m_s_i_update === 1 && (
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">{'Edit'}</Typography>
          </MenuItem>
        )}

        <MenuItem onClick={handleViewDetails}>
          <ListItemIcon>
            <VisibilityOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">{'View details'}</Typography>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default UserTableOptions;
