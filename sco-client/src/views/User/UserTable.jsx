import React, { useState, useEffect, useRef } from 'react';
import {
  Grid, Button, Avatar, Icon, Chip, Card, CardContent
} from '@material-ui/core';
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
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import RefreshIcon from '@material-ui/icons/Refresh';
import LinearProgress from '@material-ui/core/LinearProgress';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import CustomTooltip from 'src/components/CustomTooltip';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { apiGetAllUser } from 'src/services/user';
import apiUrl from 'src/apiUrl';
import UserTableOptions from './UserTableOptions';
import UserTruncateToken from './UserTruncateToken';
import { connect } from 'react-redux';


// style
const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
  progress: {
    width: '100%',
    height: 4,
  },
  container: {
    maxHeight: 400,
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
    width: 1,
  },
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  button: {
    marginRight: theme.spacing(1),
  },
}));


// component utama
const UserTable = (props) => {
  const classes = useStyles();
  const isMounted = useRef(true);
  const navigate = useNavigate();


  // state
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [rowData, setRowData] = useState({
    users: {
      current_page: 1,
      data: [],
      from: 0,
      per_page: 25,
      total: 0
    },
    search: '',
    sort: 'username',
    order_by: 'asc'
  });


  // daftar kolom untuk tabel
  const columns = [
    { field: 'username', label: 'Username' },
    { field: 'is_active', label: 'Active' },
    { field: 'profile_avatar', label: 'Avatar' },
    { field: 'profile_name', label: 'Full Name' },
    { field: 'profile_division', label: 'Division' },
    { field: 'profile_email', label: 'Email' },
    { field: 'profile_phone', label: 'Phone Number' },
    { field: 'profile_address', label: 'Address' },
    { field: 'created_at', label: 'Created At' },
    { field: 'updated_at', label: 'Updated At' },
  ];


  // inisialisasi awal untuk mengambil data dari api
  useEffect(() => {
    if (rowData.users.data.length <= 0) {
      getData();
    }
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);


  // Reload table dari luar komponen
  useEffect(() => {
    props.reload && getData();
    // eslint-disable-next-line
  }, [props.reload]);


  // Fungsi untuk mengambil data dari api
  const getData = async (
    page = rowData.users.current_page,
    perPage = rowData.users.per_page,
    query = search,
    sort = rowData.sort,
    orderBy = rowData.order_by
  ) => {
    setLoading(true);
    try {
      const res = await apiGetAllUser(page, perPage, query, sort, orderBy);
      if (isMounted.current) {
        setRowData(res.data);
        props.setReload(false);
        setLoading(false);
      }
    }
    catch (err) {
      if (isMounted.current) {
        props.setReload(false);
        setLoading(false);
        if (err.status === 401) {
          window.location.href = '/logout';
        }
      }
    }
  };


  // fungsi sortir tabel
  const handleSortTable = (sort) => {
    let orderBy = 'asc';
    if (rowData.sort === sort) {
      if (rowData.order_by === 'asc') {
        orderBy = 'desc'
      }
    }
    getData(rowData.users.current_page, rowData.users.per_page, rowData.search, sort, orderBy);
  }


  // fungsi submit form pencarian
  const handleSubmitSearch = (e) => {
    e.preventDefault();
    getData(1, rowData.users.per_page, search);
  }


  // fungsi handle blur pada form pencarian
  const handleBlur = (e) => {
    if (rowData.search === '' && search === '') {
      e.preventDefault();
    } else {
      handleSubmitSearch(e);
    }
  }


  // fungsi handle refresh pada table
  const handleRefresh = () => {
    getData();
  }


  // fungsi untuk merubah baris perhalaman pada tabel
  const handleChangeRowsPerPage = (event) => {
    let newRowData = { ...rowData };
    newRowData.users['per_page'] = event.target.value;
    newRowData.users['current_page'] = 1;
    setRowData(newRowData);
    getData(1, event.target.value);
  };


  // fungsi untuk kembali kehalaman pertama pada tabel
  const handleFirstPageButtonClick = (event) => {
    getData(1);
  };


  // fungsi untuk kembali 1 halaman pada tabel
  const handleBackButtonClick = (event) => {
    getData(rowData.users.current_page - 1);
  };


  // fungsi untuk maju 1 halamnn pada tabel
  const handleNextButtonClick = (event) => {
    getData(rowData.users.current_page + 1);
  };


  // fungsi untuk maju ke halamn terakhir pada tabel
  const handleLastPageButtonClick = (event) => {
    getData(Math.max(0, Math.ceil(rowData.users.total / rowData.users.per_page)));
  };


  // component custom untuk tabel pagination
  const TablePaginationActions = (props) => {
    return (
      <div className={classes.root}>
        <IconButton
          aria-label='first page'
          disabled={rowData.users.current_page <= 1}
          onClick={handleFirstPageButtonClick}
        >
          <FirstPageIcon />
        </IconButton>

        <IconButton
          aria-label='previous page'
          disabled={rowData.users.current_page <= 1}
          onClick={handleBackButtonClick}
        >
          <KeyboardArrowLeft />
        </IconButton>

        <IconButton
          aria-label='next page'
          disabled={rowData.users.current_page >= Math.ceil(rowData.users.total / rowData.users.per_page)}
          onClick={handleNextButtonClick}
        >
          <KeyboardArrowRight />
        </IconButton>

        <IconButton
          aria-label='last page'
          disabled={rowData.users.current_page >= Math.ceil(rowData.users.total / rowData.users.per_page)}
          onClick={handleLastPageButtonClick}
        >
          <LastPageIcon />
        </IconButton>
      </div>
    );
  }

  // render component utaman
  return (
    <Card elevation={3}>
      {loading
        ? <LinearProgress className={classes.progress} />
        : <div className={classes.progress} />
      }

      <CardContent>
        <Grid
          spacing={3}
          container
          direction='row'
          justify='space-between'
          alignItems='center'
        >
          <Grid item md={6} xs={12}>
            {props.state !== null && (
              props.state.create === 1 && (
                <Button
                  variant='contained'
                  color='primary'
                  className={classes.button}
                  startIcon={<AddCircleIcon />}
                  onClick={() => {
                    navigate('/user/create', { state: props.state });
                  }}
                >
                  Create user
                </Button>
              )
            )}

            {props.state !== null && props.state.create === 1 && props.state.update === 1 && props.state.delete === 1 && (
              <UserTruncateToken />
            )}

            <CustomTooltip title='Reload'>
              <IconButton onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </CustomTooltip>
          </Grid>

          <Grid item md={6} xs={12}>
            <form autoComplete='off' onSubmit={handleSubmitSearch}>
              <TextField
                fullWidth
                placeholder='Search users'
                variant='outlined'
                margin='dense'
                name='search'
                type='search'
                value={search}
                disabled={loading}
                onChange={e => setSearch(e.target.value)}
                onBlur={handleBlur}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Grid>

          <Grid item xs={12}>
            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>Actions</TableCell>
                    <TableCell align='center'>Is Logged In</TableCell>
                    {columns.map((col, i) => (
                      <TableCell key={i} align={col.align}>
                        <TableSortLabel
                          active={rowData.sort === col.field}
                          direction={rowData.sort === col.field ? rowData.order_by : 'asc'}
                          onClick={() => handleSortTable(col.field)}
                        >
                          {col.label}
                          {rowData.sort === col.field && (
                            <span className={classes.visuallyHidden}>
                              {rowData.order_by === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </span>
                          )}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rowData.users.data.length <= 0
                    ? (
                      <TableRow hover >
                        <TableCell colSpan={12} align='center' >
                          {loading ? 'Loading, please wait...' : 'No data in table'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      rowData.users.data.map((row, key) => (
                        <TableRow hover key={key}>
                          <TableCell align='center'>
                            <UserTableOptions
                              userId={row.id}
                              state={props.state}
                              openDialogDelete={() => props.openDialogDelete(row.id)}
                            />
                          </TableCell>
                          <TableCell align='center'>
                            <Chip
                              variant="outlined"
                              label={Boolean(row.token) ? 'Login' : 'Logout'}
                              color={Boolean(row.token) ? 'primary' : 'secondary'}
                              avatar={
                                <Avatar
                                  alt={row.profile_name}
                                  src={Boolean(row.profile_avatar) ? apiUrl(`/avatar/${row.profile_avatar}`) : ''}
                                />
                              }
                            />
                          </TableCell>
                          <TableCell>{row.username}</TableCell>
                          <TableCell>
                            <Icon color={row.is_active === 1 ? 'primary' : 'secondary'}>
                              {row.is_active === 1 ? 'check' : 'close'}
                            </Icon>
                          </TableCell>
                          <TableCell>
                            <Avatar
                              className={classes.avatar}
                              alt={row.profile_name}
                              src={Boolean(row.profile_avatar) ? apiUrl(`/avatar/${row.profile_avatar}`) : ''}
                            />
                          </TableCell>
                          <TableCell>{row.profile_name}</TableCell>
                          <TableCell>{row.profile_division === null ? '...' : row.profile_division}</TableCell>
                          <TableCell>{row.profile_email === null ? '...' : row.profile_email}</TableCell>
                          <TableCell>{row.profile_phone === null ? '...' : row.profile_phone}</TableCell>
                          <TableCell>{row.profile_address === null ? '...' : row.profile_address}</TableCell>
                          <TableCell>{row.created_at}</TableCell>
                          <TableCell>{row.updated_at}</TableCell>
                        </TableRow>
                      ))
                    )
                  }
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component='div'
              rowsPerPageOptions={[25, 50, 100, 250]}
              count={rowData.users.total}
              rowsPerPage={Number(rowData.users.per_page)}
              page={rowData.users.current_page - 1}
              onChangePage={e => e.preventDefault()}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const reduxState = (state) => ({
  reduxUserLogin: state.userLogin
});

export default connect(reduxState, null)(UserTable);
