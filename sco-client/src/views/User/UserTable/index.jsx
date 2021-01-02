import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Button,
  Card,
  CardContent,
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
import { apiGetAllUser } from 'src/services/user';
import { connect } from 'react-redux';
import UserTruncateToken from '../UserTruncateToken';
import Row from './Row';
import { reduxAction } from 'src/config/redux/state';

/**
 * style
 */
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
    maxHeight: 450,
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
  button: {
    marginRight: theme.spacing(1),
  },
}));


/**
 * component utama
 * @param {*} props 
 */
const UserTable = (props) => {
  const classes = useStyles();
  const isMounted = useRef(true);
  const navigate = useNavigate();


  /**
   * state
   */
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
    sort: 'profile_name',
    order_by: 'asc'
  });


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
    },
  ];


  /**
   * inisialisasi awal untuk mengambil data dari api
   */
  useEffect(() => {
    rowData.users.data.length <= 0 && getData();
    return () => isMounted.current = false;
    // eslint-disable-next-line
  }, []);


  /**
   * Reload table dari luar komponen
   */
  useEffect(() => {
    props.reload && getData();
    // eslint-disable-next-line
  }, [props.reload]);


  /**
   * Fungsi untuk mengambil data dari api
   * @param {int} page
   * @param {int} perPage
   * @param {string} query
   * @param {string} sort
   * @param {string "asc/desc"} orderBy
   */
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
        } else {
          props.setReduxToast(true, 'error', `(#${err.status}) ${err.data.message}`);
        }
      }
    }
  };


  /**
   * fungsi sortir tabel
   * @param {string} sort 
   */
  const handleSortTable = (sort) => {
    let orderBy = 'asc';
    if (rowData.sort === sort) {
      if (rowData.order_by === 'asc') {
        orderBy = 'desc'
      }
    }
    getData(rowData.users.current_page, rowData.users.per_page, rowData.search, sort, orderBy);
  }


  /**
   * fungsi submit form pencarian
   * @param {*} e 
   */
  const handleSubmitSearch = (e) => {
    e.preventDefault();
    getData(1, rowData.users.per_page, search);
  }


  /**
   * fungsi handle blur pada form pencarian
   * @param {obj} e 
   */
  const handleBlur = (e) => {
    if (rowData.search === '' && search === '') {
      e.preventDefault();
    } else {
      handleSubmitSearch(e);
    }
  }


  /**
   * fungsi untuk merubah baris perhalaman pada tabel
   * @param {obj} event 
   */
  const handleChangeRowsPerPage = (event) => {
    let newRowData = { ...rowData };
    newRowData.users['per_page'] = event.target.value;
    newRowData.users['current_page'] = 1;
    setRowData(newRowData);
    getData(1, event.target.value);
  };


  /**
   * fungsi untuk kembali kehalaman pertama pada tabel
   * @param {obj} event 
   */
  const handleFirstPageButtonClick = (event) => {
    getData(1);
  };


  /**
   * fungsi untuk kembali 1 halaman pada tabel
   * @param {obj} event 
   */
  const handleBackButtonClick = (event) => {
    getData(rowData.users.current_page - 1);
  };


  /**
   * fungsi untuk maju 1 halamnn pada tabel
   * @param {obj} event 
   */
  const handleNextButtonClick = (event) => {
    getData(rowData.users.current_page + 1);
  };


  /**
   * fungsi untuk maju ke halamn terakhir pada tabel
   * @param {obj} event 
   */
  const handleLastPageButtonClick = (event) => {
    getData(Math.max(0, Math.ceil(rowData.users.total / rowData.users.per_page)));
  };


  /**
   * component custom untuk tabel pagination
   */
  const TablePaginationActions = () => {
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

  /**
   * render component utaman
   */
  return (
    <Card
      variant={props.reduxTheme === 'dark' ? 'outlined' : 'elevation'}
      elevation={3}
    >
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
          <Grid item lg={4} md={6} xs={12}>
            {props.state !== null && (
              props.state.create === 1 && (
                <Button
                  variant='contained'
                  color='primary'
                  className={classes.button}
                  onClick={() => navigate('/user/create', { state: props.state })}
                >
                  {'Create a new user'}
                </Button>
              )
            )}

            {props.state !== null && props.state.create === 1 && props.state.update === 1 && props.state.delete === 1 && (
              <UserTruncateToken />
            )}

            <CustomTooltip title='Reload'>
              <IconButton onClick={() => getData()}>
                <RefreshIcon />
              </IconButton>
            </CustomTooltip>
          </Grid>

          <Grid item lg={8} md={6} xs={12}>
            <form autoComplete='off' onSubmit={handleSubmitSearch}>
              <TextField
                fullWidth
                variant='outlined'
                label='Search users'
                margin='dense'
                name='search'
                type='search'
                value={search}
                disabled={loading}
                onBlur={handleBlur}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Grid>

          <Grid item xs={12}>
            <TableContainer className={classes.container}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>{'Options'}</TableCell>

                    {columns.map((col, i) => (
                      <TableCell
                        key={i}
                        align={col.align}
                      >
                        <TableSortLabel
                          active={rowData.sort === col.field}
                          onClick={() => handleSortTable(col.field)}
                          direction={
                            rowData.sort === col.field
                              ? rowData.order_by
                              : 'asc'
                          }
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
                        <Row
                          key={key}
                          row={row}
                          state={props.state}
                          onDelete={() => props.onDelete(row.id)}
                          onChangePassword={() => props.onChangePassword(row.id)}
                        />
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
    </Card >
  );
};


/**
 * Redux state
 * @param {obj} state 
 */
function reduxState(state) {
  return {
    reduxUserLogin: state.userLogin,
    reduxTheme: state.theme,
  }
};


/**
 * Redux dispatch
 * @param {obj} dispatch 
 */
function reduxDispatch(dispatch) {
  return {
    setReduxToast: (
      show = false,
      type = 'success',
      message = ''
    ) => dispatch({
      type: reduxAction.toast,
      value: {
        show: show,
        type: type,
        message: message
      }
    }),
  }
}


export default connect(reduxState, reduxDispatch)(UserTable);
