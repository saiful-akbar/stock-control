import React from "react";
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
  TextField,
} from "@material-ui/core";
import { makeStyles, lighten } from "@material-ui/core/styles";
import clsx from "clsx";
import CustomTooltip from "src/components/CustomTooltip";
import RefreshIcon from "@material-ui/icons/Refresh";
import SearchIcon from "@material-ui/icons/Search";
import DeleteIcon from '@material-ui/icons/Delete';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import { apiExportItemGroup } from "src/services/itemGroups";
import { connect } from "react-redux";
import { reduxAction } from "src/config/redux/state";
import CancelIcon from '@material-ui/icons/Cancel';


/**
 * Style untuk komponen utama
 */
const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    marginBottom: theme.spacing(2),
  },
  highlight:
    theme.palette.type === "light"
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: "1 1 100%",
    marginLeft: theme.spacing(2),
  },
  buttonDelete: {
    marginRight: theme.spacing(2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.type === 'dark' ? 'rgba(19, 28, 33, 0.8)' : 'rgba(255, 255, 255, 0.8)',
  },
}));


/**
 * Komponnet utama
 */
function TheadActions({
  selected,
  loading,
  searchValue,
  onReload,
  onSearch,
  onAdd,
  onDelete,
  userAccess,
  setReduxToast,
  ...props
}) {


  /**
   * State
   */
  const [search, setSearch] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isOpenBackdrop, setOpenBackdrop] = React.useState(false);

  const open = Boolean(anchorEl);
  const classes = useStyles();
  const isMounted = React.useRef(true);


  /**
   * handle jika komponen dilepas saat request api belum selesai.
   */
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    }

    // eslint-disable-next-line
  }, []);


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
   * Handle submit form search
   */
  const handleSubmitSearch = (e) => {
    e.preventDefault();
    onSearch(search);
  }


  /**
   * Handle blur form search
   */
  const handleBlurSearch = (e) => {
    if (searchValue !== search) {
      onSearch(search);
    } else {
      e.preventDefault();
    }
  }


  /**
   * Handle clear form search
   */
  const handleClearSearch = (e) => {
    e.preventDefault();
    setSearch("");
    onSearch("");
  }


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
        link.setAttribute('download', `item groups (${date.toLocaleString()}).xlsx`); //or any other extension
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
  }


  /**
   * Render komponent utama
   */
  return (
    <>
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: Boolean(selected.length > 0),
        })}
      >
        {selected.length > 0
          ? (
            <React.Fragment>
              <Typography
                className={classes.title}
                color="inherit"
                variant="subtitle1"
                component="div"
              >
                {selected.length} {"selected"}
              </Typography>

              <CustomTooltip title="Delete" placement="bottom">
                <IconButton className={classes.buttonDelete} onClick={onDelete}>
                  <DeleteIcon />
                </IconButton>
              </CustomTooltip>
            </React.Fragment>
          ) : (
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              spacing={3}
            >
              <Grid item lg={4} md={6} xs={12}>
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Box
                    mr={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
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

                  {userAccess !== null && (
                    userAccess.user_m_s_i_create === 1 && (
                      <Button
                        fullWidth
                        color="primary"
                        variant="contained"
                        onClick={onAdd}
                      >
                        {"Add Item Group"}
                      </Button>
                    )
                  )}
                </Box>
              </Grid>

              <Grid item lg={8} md={6} xs={12}>
                <form onSubmit={handleSubmitSearch} autoComplete="off" >
                  <TextField
                    fullWidth
                    placeholder='Search by groups code or groups name'
                    variant='outlined'
                    margin='dense'
                    name='search'
                    type='text'
                    value={search}
                    disabled={loading}
                    onChange={e => setSearch(e.target.value)}
                    onBlur={handleBlurSearch}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        searchValue !== "" && search !== "" && (
                          <InputAdornment position='end'>
                            <IconButton size="small" onClick={handleClearSearch}>
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        )
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
        <MenuItem onClick={handleExport} >
          <Typography variant='inherit'>
            {"Export to excel"}
          </Typography>
        </MenuItem>

        {userAccess !== null && userAccess.user_m_s_i_create === 1 && (
          <MenuItem onClick={handleCloseMenu} >
            <Typography variant='inherit'>
              {"Import from excel"}
            </Typography>
          </MenuItem>
        )}
      </Menu>

      <Backdrop className={classes.backdrop} open={isOpenBackdrop}>
        <CircularProgress color="primary" size={50} />
      </Backdrop>
    </>
  )
}


/**
 * Default props komponen TheadActions
 */
TheadActions.defaultProps = {
  selected: [],
  loading: false,
  userAccess: null,
  searchValue: "",
  onReload: (e) => e.preventDefault(),
  onSearch: (e) => e.preventDefault(),
  onAdd: (e) => e.preventDefault(),
  onDelete: (e) => e.preventDefault(),
};


/**
 * Redux dispatch
 */
function reduxDispatch(dispatch) {
  return {
    setReduxToast: (show, type, message) => dispatch({
      type: reduxAction.toast,
      value: {
        show: show,
        type: type,
        message: message,
      }
    }),
  };
}


export default connect(null, reduxDispatch)(TheadActions);