import React from 'react';
import {
  Grid,
  Button,
  Box,
  IconButton,
  Typography,
  Toolbar,
  InputAdornment,
  TextField
} from '@material-ui/core';
import { makeStyles, lighten } from '@material-ui/core/styles';
import clsx from 'clsx';
import CustomTooltip from 'src/components/CustomTooltip';
import RefreshIcon from '@material-ui/icons/Refresh';
import SearchIcon from '@material-ui/icons/Search';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';

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
        ? 'rgba(19, 28, 33, 0.8)'
        : 'rgba(255, 255, 255, 0.8)'
  }
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
  onImport,
  ...props
}) {
  const classes = useStyles();
  const isMounted = React.useRef(true);

  /* State */
  const [search, setSearch] = React.useState('');

  /* handle jika komponen dilepas saat request api belum selesai. */
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };

    // eslint-disable-next-line
  }, []);

  /* Handle submit form search */
  const handleSubmitSearch = e => {
    e.preventDefault();
    onSearch(search);
  };

  /* Handle blur form search */
  const handleBlurSearch = e => {
    if (searchValue !== search) {
      onSearch(search);
    } else {
      e.preventDefault();
    }
  };

  /* Handle clear form search */
  const handleClearSearch = e => {
    e.preventDefault();
    setSearch('');
    onSearch('');
  };

  /* Render komponent utama */
  return (
    <>
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: Boolean(selected.length > 0)
        })}
      >
        {selected.length > 0 ? (
          <React.Fragment>
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
                    {'Add Document'}
                  </Button>
                )}
              </Box>
            </Grid>

            <Grid item lg={8} md={6} xs={12}>
              <form onSubmit={handleSubmitSearch} autoComplete="off">
                <TextField
                  fullWidth
                  placeholder="Search by title or description"
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
                      searchValue !== '' && search !== ''
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
    </>
  );
}

/* Default props komponen TheadActions */
TheadActions.defaultProps = {
  selected: [],
  loading: false,
  userAccess: null,
  searchValue: '',
  onAdd: e => e.preventDefault(),
  onReload: e => e.preventDefault(),
  onSearch: e => e.preventDefault(),
  onDelete: e => e.preventDefault(),
  onImport: e => e.preventDefault()
};

/* Redux dispatch */
function reduxDispatch(dispatch) {
  return {
    setReduxToast: (show, type, message) =>
      dispatch({
        type: reduxAction.toast,
        value: {
          show: show,
          type: type,
          message: message
        }
      })
  };
}

export default connect(null, reduxDispatch)(TheadActions);
