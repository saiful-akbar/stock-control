import React, { useEffect, useState, useRef } from 'react';
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
import { useSelector } from 'react-redux';
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
  userAccess,
  selected,
  loading,
  onReload,
  onSearch,
  onAdd,
  onDelete
}) {
  const classes = useStyles();
  const isMounted = useRef(true);
  const { documents } = useSelector(state => state.documentsReducer);

  /* State */
  const [search, setSearch] = useState('');

  /* handle jika komponen dilepas saat request api belum selesai. */
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  /* Set setch value sesuai data documentsReducer.search */
  useEffect(() => {
    setSearch(documents.search);
  }, [documents.search]);

  /* Handle submit form search */
  const handleSubmitSearch = e => {
    e.preventDefault();
    onSearch(search);
  };

  /* Handle blur form search */
  const handleBlurSearch = e => {
    e.preventDefault();
    if (documents.search !== search) onSearch(search);
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
            <Grid item md={4} sm={6} xs={12}>
              <Box display="flex" justifyContent="flex-start">
                <Box mr={2} display="flex" justifyContent="center">
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

            <Grid item md={8} sm={6} xs={12}>
              <form onSubmit={handleSubmitSearch} autoComplete="off">
                <TextField
                  fullWidth
                  placeholder="Search documents"
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
                    endAdornment: documents.search !== '' && search !== '' && (
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
  onAdd: () => {},
  onReload: () => {},
  onSearch: () => {},
  onDelete: () => {}
};

export default TheadActions;
