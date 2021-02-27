import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Typography } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CustomTooltip from 'src/components/CustomTooltip';

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
   * Link menu akses
   */
  const handleChangeUserMenus = () => {
    handleCloseMenu();
    navigate(`/users/${userData.id}/menus`);
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
  const handleViewDetail = () => {
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
          <MenuItem onClick={handleChangeUserMenus}>
            <Typography variant="inherit">{'Access Menu'}</Typography>
          </MenuItem>
        )}

        {state !== null && state.user_m_s_i_update === 1 && (
          <MenuItem onClick={handleChangePassword}>
            <Typography variant="inherit">{'Change password'}</Typography>
          </MenuItem>
        )}

        {state !== null && state.user_m_s_i_delete === 1 && (
          <MenuItem onClick={handleDelete}>
            <Typography variant="inherit">{'Delete'}</Typography>
          </MenuItem>
        )}

        <MenuItem onClick={handleViewDetail}>
          <Typography variant="inherit">{'Detail info'}</Typography>
        </MenuItem>

        {state !== null && state.user_m_s_i_update === 1 && (
          <MenuItem onClick={handleEdit}>
            <Typography variant="inherit">{'Edit'}</Typography>
          </MenuItem>
        )}
      </Menu>
    </React.Fragment>
  );
};

export default UserTableOptions;
