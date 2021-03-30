import React, { useState, useEffect, useRef } from 'react';
import { Grid, Button, Card, CardContent, Box } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import CustomTooltip from 'src/components/CustomTooltip';
import { apiGetAllUser } from 'src/services/user';
import { useSelector, useDispatch } from 'react-redux';
import UserTruncateToken from '../UserTruncateToken';
import Row from './Row';
import Loader from 'src/components/Loader';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

/**
 * style
 */
const useStyles = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5)
  },
  container: {
    maxHeight: '70vh'
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  },
  tableCell: {
    padding: 10
  }
}));

/**
 * component utama
 * @param {*} props
 */
const UserTable = ({ userAccess, onDelete, onChangePassword, onClearLogs }) => {
  const classes = useStyles();
  const isMounted = useRef(true);
  const navigate = useNavigate();

  /**
   * Redux
   */
  const { users } = useSelector(state => state.usersReducer);
  const dispatch = useDispatch();

  /**
   * state
   */
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(users.search);

  /**
   * Daftar kolom untuk tabel
   */
  const columns = [
    {
      field: 'profile_name',
      label: 'Name',
      align: 'left'
    },
    {
      field: 'username',
      label: 'Username',
      align: 'left'
    },
    {
      field: 'is_active',
      label: 'Active',
      align: 'left'
    },
    {
      field: 'created_at',
      label: 'Created At',
      align: 'left'
    },
    {
      field: 'updated_at',
      label: 'Updated At',
      align: 'left'
    }
  ];

  /**
   * inisialisasi awal untuk mengambil data dari api
   */
  useEffect(() => {
    if (users.data === null) getDataUsers();

    return () => {
      isMounted.current = false;
    };

    // eslint-disable-next-line
  }, []);

  /**
   * Fungsi untuk mengambil data dari api
   * @param {int} page
   * @param {int} perPage
   * @param {string} query
   * @param {string} sort
   * @param {string "asc/desc"} orderBy
   */
  const getDataUsers = (
    data = {
      page: 1, // halaman saat ini
      perPage: 25, // baris per
      sort: 'profile_name', // sortir
      orderBy: 'asc', // urutan baris berdasarkan asc||desc
      search: '' // pencarian
    }
  ) => {
    setLoading(true);
    dispatch(apiGetAllUser(data))
      .then(res => {
        if (isMounted.current) setLoading(false);
      })
      .catch(err => {
        if (isMounted.current) {
          switch (err.status) {
            case 401:
              window.location.href = '/logout';
              break;

            case 403:
              navigate('/error/forbidden');
              break;

            case 404:
              navigate('/error/notfound');
              break;

            default:
              setLoading(false);
              break;
          }
        }
      });
  };

  /**
   * fungsi sortir tabel
   * @param {string} sort
   */
  const handleSortTable = newSort => {
    let orderBy = 'asc';
    if (users.sort === newSort && users.orderBy === 'asc') {
      orderBy = 'desc';
    }
    getDataUsers({
      sort: newSort, // sortir
      orderBy: orderBy, // urutan baris berdasarkan asc||desc
      page: users.currentPage, // halaman saat ini
      perPage: users.perPage, // baris per
      search: users.search // pencarian
    });
  };

  /**
   * fungsi submit form pencarian
   * @param {*} e
   */
  const handleSubmitFormSearch = e => {
    e.preventDefault();
    getDataUsers({
      search: search, // pencarian
      page: 1, // halaman saat ini
      sort: users.sort, // sortir
      orderBy: users.orderBy, // urutan baris berdasarkan asc||desc
      perPage: users.perPage // baris per
    });
  };

  /**
   * fungsi handle blur pada form pencarian
   * @param {obj} e
   */
  const handleBlurFormSearch = e => {
    e.preventDefault();
    if (users.search !== search) handleSubmitFormSearch(e);
  };

  /**
   * Handle clear form search
   */
  const handleClearFormSearch = e => {
    setSearch('');
    getDataUsers({
      search: '', // pencarian
      page: 1, // halaman saat ini
      sort: users.sort, // sortir
      orderBy: users.orderBy, // urutan baris berdasarkan asc||desc
      perPage: users.perPage // baris per
    });
  };

  /**
   * fungsi untuk merubah baris perhalaman pada tabel
   * @param {obj} event
   */
  const handleChangeRowsPerPage = event => {
    let newUsers = { ...users };
    newUsers['perPage'] = event.target.value;
    newUsers['currentPage'] = 1;

    getDataUsers(newUsers);
  };

  /**
   * Fungsi untuk next atau prev halaman tabel
   * @param {*} e
   * @param {*} newPage
   */
  const handleChangePage = (e, newPage) => {
    e.preventDefault();
    getDataUsers({
      page: newPage + 1, // page
      perPage: users.perPage, // perPage
      sort: users.sort, // sort
      orderBy: users.orderBy, // orderBy
      search: users.search // search
    });
  };

  /**
   * Fungsi untuk reload table
   */
  const handleReloadTable = () => {
    getDataUsers({ ...users });
  };

  /**
   * render component utaman
   */
  return (
    <Card variant="elevation" elevation={3}>
      <CardContent>
        <Grid
          spacing={3}
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item lg={5} md={6} xs={12}>
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              mt={0.5}
            >
              <Box
                mr={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {userAccess.delete === 1 && <UserTruncateToken />}

                <CustomTooltip title="Reload">
                  <IconButton onClick={handleReloadTable}>
                    <RefreshIcon />
                  </IconButton>
                </CustomTooltip>
              </Box>

              {userAccess.create === 1 && (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/users/create')}
                >
                  {'Create a new user'}
                </Button>
              )}
            </Box>
          </Grid>

          <Grid item lg={7} md={6} xs={12}>
            <form autoComplete="off" onSubmit={handleSubmitFormSearch}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by name or username"
                margin="dense"
                name="search"
                type="text"
                value={search}
                disabled={loading}
                onBlur={handleBlurFormSearch}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: users.search !== '' && search !== '' && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleClearFormSearch}>
                        <CancelOutlinedIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </form>
          </Grid>

          <Grid item xs={12}>
            <Loader show={Boolean(userAccess.read !== 1 || loading)}>
              <TableContainer className={classes.container}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableCell} align="center">
                        {'Options'}
                      </TableCell>

                      {columns.map((col, i) => (
                        <TableCell
                          className={classes.tableCell}
                          key={i}
                          align={col.align}
                        >
                          <TableSortLabel
                            active={users.sort === col.field}
                            onClick={() => handleSortTable(col.field)}
                            direction={
                              users.sort === col.field ? users.orderBy : 'asc'
                            }
                          >
                            {col.label}
                            {users.sort === col.field && (
                              <span className={classes.visuallyHidden}>
                                {users.orderBy === 'desc'
                                  ? 'sorted descending'
                                  : 'sorted ascending'}
                              </span>
                            )}
                          </TableSortLabel>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {Boolean(users.data === null || users.data.length <= 0) ? (
                      <TableRow hover>
                        <TableCell
                          className={classes.tableCell}
                          colSpan={12}
                          align="center"
                        >
                          {loading ? 'Loading...' : 'No data in table'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.data.map((row, key) => (
                        <Row
                          key={key}
                          row={row}
                          userAccess={userAccess}
                          onDelete={() => onDelete(row.id)}
                          onClearLogs={() => onClearLogs(row.id)}
                          onChangePassword={() => onChangePassword(row.id)}
                        />
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                rowsPerPageOptions={[25, 50, 100, 250]}
                count={users.totalData}
                rowsPerPage={users.perPage}
                page={users.currentPage - 1}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Loader>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserTable;
