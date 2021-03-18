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
import DeleteSweepOutlinedIcon from '@material-ui/icons/DeleteSweepOutlined';

// Componen utama
const UserTableOptions = ({
  userData,
  state,
  onDelete,
  onChangePassword,
  onClearLogs
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
  const handleEditUser = () => {
    handleCloseMenu();
    navigate(`/users/${userData.id}/edit`);
  };

  /**
   * Handle delete
   */
  const handleDeleteUser = () => {
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
  const handleGoToViewDetails = () => {
    handleCloseMenu();
    navigate(`/users/${userData.id}`);
  };

  /**
   * Menghapus user logs
   */
  const handleClearUserLogs = () => {
    onClearLogs();
    handleCloseMenu();
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
        {Boolean(state !== null && state.user_m_s_i_update === 1) && (
          <MenuItem onClick={handleChangePassword}>
            <ListItemIcon>
              <LockOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">{'Change password'}</Typography>
          </MenuItem>
        )}

        {Boolean(state !== null && state.user_m_s_i_delete === 1) && (
          <MenuItem onClick={handleClearUserLogs}>
            <ListItemIcon>
              <DeleteSweepOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">{'Clear logs'}</Typography>
          </MenuItem>
        )}

        {Boolean(state !== null && state.user_m_s_i_delete === 1) && (
          <MenuItem onClick={handleDeleteUser}>
            <ListItemIcon>
              <DeleteOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">{'Delete'}</Typography>
          </MenuItem>
        )}

        {Boolean(state !== null && state.user_m_s_i_update === 1) && (
          <MenuItem onClick={handleEditUser}>
            <ListItemIcon>
              <EditOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">{'Edit'}</Typography>
          </MenuItem>
        )}

        {Boolean(state !== null && state.user_m_s_i_read === 1) && (
          <MenuItem onClick={handleGoToViewDetails}>
            <ListItemIcon>
              <VisibilityOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">{'View details'}</Typography>
          </MenuItem>
        )}
      </Menu>
    </React.Fragment>
  );
};

export default UserTableOptions;
