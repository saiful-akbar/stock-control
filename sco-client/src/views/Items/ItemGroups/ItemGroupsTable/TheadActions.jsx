import React, { useEffect, useState, useRef } from 'react';
import {
  Grid,
  Button,
  Box,
  IconButton,
  Typography,
  Toolbar,
  InputAdornment,
  Menu,
  MenuItem,
  Backdrop,
  CircularProgress,
  TextField
} from '@material-ui/core';
import { makeStyles, lighten } from '@material-ui/core/styles';
import clsx from 'clsx';
import CustomTooltip from 'src/components/CustomTooltip';
import RefreshIcon from '@material-ui/icons/Refresh';
import SearchIcon from '@material-ui/icons/Search';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import { apiExportItemGroup } from 'src/services/itemGroups';
import { connect, useSelector } from 'react-redux';

/**
 * Style untuk komponen utama
 */
const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    marginBottom: theme.spacing(2)
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  title: {
    flex: '1 1 100%',
    marginLeft: theme.spacing(2)
  },
  buttonDelete: {
    marginRight: theme.spacing(2)
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor:
      theme.palette.type === 'dark'
        ? 'rgba(0, 0, 0, 0.6)'
        : 'rgba(255, 255, 255, 0.6)'
  }
}));

/**
 * Komponnet utama
 */
function TheadActions({
  selected,
  loading,
  onReload,
  onSearch,
  onAdd,
  onDelete,
  userAccess,
  setReduxToast,
  onImport
}) {
  const classes = useStyles();
  const isMounted = useRef(true);

  /**
   * Redux
   */
  const { itemGroups } = useSelector(state => state.itemGroupsReducer);

  /* State */
  const [search, setSearch] = useState('');
  const [isOpenBackdrop, setOpenBackdrop] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  /* handle jika komponen dilepas saat request api belum selesai. */
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };

    // eslint-disable-next-line
  }, []);

  /* Set setch value sesuai data itemGroupsReducer.search */
  useEffect(() => {
    setSearch(itemGroups.search);
  }, [itemGroups.search]);

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
   * Handle submit form search
   */
  const handleSubmitSearch = e => {
    e.preventDefault();
    onSearch(search);
  };

  /**
   * Handle blur form search
   */
  const handleBlurSearch = e => {
    e.preventDefault();
    if (itemGroups.search !== search) onSearch(search);
  };

  /**
   * Handle clear form search
   */
  const handleClearSearch = e => {
    e.preventDefault();
    setSearch('');
    onSearch('');
  };

  /**
   * Handle menu import on click
   */
  const handleImportClick = () => {
    onImport();
    handleCloseMenu();
  };

  /**
   * handle export
   */
  const handleExport = async () => {
    handleCloseMenu();
    setOpenBackdrop(true);
    try {
      const res = await apiExportItemGroup(search);
      if (isMounted.current) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        const date = new Date();

        link.href = url;
        link.setAttribute(
          'download',
          `Item Groups (${date.toLocaleString()}).xlsx`
        ); //or any other extension
        document.body.appendChild(link);
        link.click();
        link.remove();
        setOpenBackdrop(false);
      }
    } catch (err) {
      if (isMounted.current) {
        setOpenBackdrop(false);
        setReduxToast(true, 'error', `(#${err.status}) ${err.statusText}`);
      }
    }
  };

  /**
   * Render komponent utama
   */
  return (
    <>
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: Boolean(selected.length > 0)
        })}
      >
        {selected.length > 0 ? (
          <>
            <Typography
              className={classes.title}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {selected.length} {'selected'}
            </Typography>

            <CustomTooltip title="Delete" placement="bottom">
              <IconButton className={classes.buttonDelete} onClick={onDelete}>
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </CustomTooltip>
          </>
        ) : (
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            spacing={3}
          >
            <Grid item lg={4} md={6} xs={12}>
              <Box display="flex" justifyContent="space-between">
                <Box mr={2} display="flex" justifyContent="center">
                  <CustomTooltip title="Export or import" placement="bottom">
                    <IconButton onClick={handleClickMenu}>
                      <ImportExportIcon />
                    </IconButton>
                  </CustomTooltip>

                  <CustomTooltip title="Reload" placement="bottom">
                    <IconButton onClick={onReload}>
                      <RefreshIcon />
                    </IconButton>
                  </CustomTooltip>
                </Box>

                {userAccess !== null && userAccess.user_m_s_i_create === 1 && (
                  <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    onClick={onAdd}
                  >
                    {'Add Item Group'}
                  </Button>
                )}
              </Box>
            </Grid>

            <Grid item lg={8} md={6} xs={12}>
              <form onSubmit={handleSubmitSearch} autoComplete="off">
                <TextField
                  fullWidth
                  placeholder="Search item groups"
                  variant="outlined"
                  margin="dense"
                  name="search"
                  type="text"
                  value={search}
                  disabled={loading}
                  onChange={e => setSearch(e.target.value)}
                  onBlur={handleBlurSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: Boolean(
                      itemGroups.search !== '' && search !== ''
                    ) && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={handleClearSearch}>
                          <CancelOutlinedIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </form>
            </Grid>
          </Grid>
        )}
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleExport}>
          <Typography variant="inherit">{'Export to excel'}</Typography>
        </MenuItem>

        {userAccess !== null && userAccess.user_m_s_i_create === 1 && (
          <MenuItem onClick={handleImportClick}>
            <Typography variant="inherit">{'Import from excel'}</Typography>
          </MenuItem>
        )}
      </Menu>

      <Backdrop className={classes.backdrop} open={isOpenBackdrop}>
        <CircularProgress color="primary" size={50} />
      </Backdrop>
    </>
  );
}

/**
 * Default props komponen TheadActions
 */
TheadActions.defaultProps = {
  selected: [],
  loading: false,
  userAccess: null,
  onAdd: e => e.preventDefault(),
  onReload: e => e.preventDefault(),
  onSearch: e => e.preventDefault(),
  onDelete: e => e.preventDefault(),
  onImport: e => e.preventDefault()
};

/**
 * Redux dispatch
 */
function reduxDispatch(dispatch) {
  return {
    setReduxToast: (show, type, message) =>
      dispatch({
        type: 'SET_TOAST',
        value: {
          show: show,
          type: type,
          message: message
        }
      })
  };
}

export default connect(null, reduxDispatch)(TheadActions);
