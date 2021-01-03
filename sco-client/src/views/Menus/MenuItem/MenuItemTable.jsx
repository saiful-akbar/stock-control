import React, { useState, useEffect, useRef } from 'react';
import {
  Grid, Button, Icon, Card, CardContent, Box
} from '@material-ui/core';

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
import { apiGetAllMenuItem } from 'src/services/menuItem';
import CustomTooltip from 'src/components/CustomTooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Toast from 'src/components/Toast';
import { connect } from 'react-redux';


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
    margin: 0,
    padding: 0,
  },
  container: {
    maxHeight: "60vh",
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
  red: {
    color: theme.palette.error.light,
  },
  green: {
    color: theme.palette.success.light,
  },
  tableCell: {
    paddingBottom: 10,
    paddingTop: 10
  }
}));


/**
 * component utama
 * @param {*} props 
 */
const MenuItemTable = (props) => {
  const classes = useStyles();
  const isMounted = useRef(true);


  /**
   * State
   */
  const [toast, setToast] = React.useState({ show: false, type: null, message: '' });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [rowData, setRowData] = useState({
    menu_items: {
      current_page: 1,
      from: 1,
      last_page: 0,
      per_page: 25,
      to: 0,
      total: 0,
      data: [],
      links: [],
      path: '',
      first_page_url: '',
      last_page_url: '',
      next_page_url: '',
      prev_page_url: null,
    },
    search: '',
    sort: 'menu_i_title',
    order_by: 'asc',
  });


  /**
   * Daftar kolom untuk tabel
   */
  const columns = [
    {
      field: 'menu_i_title',
      label: 'Title',
      align: 'left'
    },
    {
      field: 'menu_i_url',
      label: 'Path',
      align: 'left'
    },
    {
      field: 'menu_i_icon',
      label: 'Icon',
      align: 'left'
    },
    {
      field: 'menu_i_children',
      label: 'Sub Menu',
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
    if (rowData.menu_items.data.length <= 0) {
      getData();
    }
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);


  /**
   * reload table setelah terjadi aksi
   */
  useEffect(() => {
    if (props.reload) {
      getData();
    }
    // eslint-disable-next-line
  }, [props.reload]);


  /**
   * Fungsi untuk mengambil data dari api
   * @param {int} page 
   * @param {int} perPage 
   * @param {string} querySearch 
   * @param {string} sort 
   * @param {"asc/desc"} orderBy
   */
  const getData = async (
    page = rowData.menu_items.current_page,
    perPage = rowData.menu_items.per_page,
    querySearch = search,
    sort = rowData.sort,
    orderBy = rowData.order_by
  ) => {
    setLoading(true);
    try {
      const res = await apiGetAllMenuItem(page, perPage, querySearch, sort, orderBy);
      if (isMounted.current) {
        setRowData(res.data);
      }
    }
    catch (err) {
      if (isMounted.current) {
        if (err.status === 401) {
          window.location.href = '/logout';
        } else {
          setToast({
            show: true,
            type: 'error',
            message: `(#${err.status}) ${err.data.message}`
          });
        }
      }
    }
    if (isMounted.current) {
      setLoading(false);
      props.stopReload();
    }
  };


  /**
   * fungsi sortir tabel
   * @param {string "asc/desc"} sort 
   */
  const handleSortTable = (sort) => {
    let orderBy = 'asc';
    if (rowData.sort === sort) {
      if (rowData.order_by === 'asc') {
        orderBy = 'desc'
      }
    }
    getData(
      rowData.menu_items.current_page,
      rowData.menu_items.per_page,
      rowData.search,
      sort,
      orderBy
    );
  }


  /**
   * fungsi submit form pencarian
   * @param {obj} e 
   */
  const handleSubmitSearch = (e) => {
    e.preventDefault();
    getData(1, rowData.menu_items.per_page, search);
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
   * fungsi handle refresh pada table
   */
  const handleRefresh = () => {
    getData();
  }


  /**
   * fungsi untuk merubah baris perhalaman pada tabel
   * @param {obj} event 
   */
  const handleChangeRowsPerPage = (event) => {
    let newRowData = { ...rowData };
    newRowData.menu_items['per_page'] = event.target.value;
    newRowData.menu_items['current_page'] = 1;
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
   * fungsi untuk kembali 1 halaman sebelumnya
   * @param {object} event 
   */
  const handleBackButtonClick = (event) => {
    getData(rowData.menu_items.current_page - 1);
  };


  /**
   * fungsi untuk maju 1 halamnn berikutnya
   * @param {obj} event 
   */
  const handleNextButtonClick = (event) => {
    getData(rowData.menu_items.current_page + 1);
  };


  /**
   * fungsi untuk maju ke halamn terakhir pada tabel
   * @param {obj} event 
   */
  const handleLastPageButtonClick = (event) => {
    getData(Math.max(0, Math.ceil(rowData.menu_items.total / rowData.menu_items.per_page)));
  };


  /**
   * component custom untuk tabel pagination
   * @param {*} props 
   */
  const TablePaginationActions = (props) => {
    return (
      <div className={classes.root}>
        <IconButton
          aria-label='first page'
          disabled={rowData.menu_items.current_page <= 1}
          onClick={handleFirstPageButtonClick}
        >
          <FirstPageIcon />
        </IconButton>

        <IconButton
          aria-label='previous page'
          disabled={rowData.menu_items.current_page <= 1}
          onClick={handleBackButtonClick}
        >
          <KeyboardArrowLeft />
        </IconButton>

        <IconButton
          aria-label='next page'
          disabled={rowData.menu_items.current_page >= Math.ceil(rowData.menu_items.total / rowData.menu_items.per_page)}
          onClick={handleNextButtonClick}
        >
          <KeyboardArrowRight />
        </IconButton>

        <IconButton
          aria-label='last page'
          disabled={rowData.menu_items.current_page >= Math.ceil(rowData.menu_items.total / rowData.menu_items.per_page)}
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
    <>
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
            <Grid item md={4} sm={6} xs={12}>
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
                  <CustomTooltip title='Reload'>
                    <IconButton onClick={handleRefresh}>
                      <RefreshIcon />
                    </IconButton>
                  </CustomTooltip>
                </Box>

                {props.state !== null && (
                  props.state.create === 1 && (
                    <Button
                      fullWidth
                      color='primary'
                      variant='contained'
                      onClick={() => props.openDialogCreate()}
                    >
                      {'Create a new menu'}
                    </Button>
                  )
                )}
              </Box>
            </Grid>

            <Grid item md={8} sm={6} xs={12}>
              <form autoComplete='off' onSubmit={handleSubmitSearch}>
                <TextField
                  fullWidth
                  label='Search menu items'
                  variant='outlined'
                  margin='dense'
                  name='search'
                  type='search'
                  value={search}
                  disabled={loading}
                  onChange={e => setSearch(e.target.value)}
                  onBlur={handleBlur}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
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
                      {columns.map((col, i) => (
                        <TableCell key={i} className={classes.tableCell} align={col.align}>
                          <TableSortLabel
                            active={Boolean(rowData.sort === col.field)}
                            direction={rowData.sort === col.field ? rowData.order_by : 'asc'}
                            onClick={() => handleSortTable(col.field)}
                          >
                            {col.label}
                            {rowData.sort === col.field
                              ? (
                                <span className={classes.visuallyHidden}>
                                  {rowData.order_by === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                              ) : null
                            }
                          </TableSortLabel>
                        </TableCell>
                      ))}

                      {props.state !== null && (
                        props.state.update === 1 || props.state.delete === 1
                          ? (
                            <TableCell className={classes.tableCell} align='center'>
                              {'Actions'}
                            </TableCell>
                          ) : (
                            <TableCell className={classes.tableCell} />
                          )
                      )}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rowData.menu_items.data.length <= 0
                      ? (
                        <TableRow hover >
                          <TableCell
                            colSpan={7}
                            align='center'
                            className={classes.tableCell}
                          >
                            {loading ? 'Loading, please wait...' : 'No data in table'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        rowData.menu_items.data.map((row, key) => (
                          <TableRow hover key={key}>
                            <TableCell className={classes.tableCell}>{row.menu_i_title}</TableCell>
                            <TableCell className={classes.tableCell}>{row.menu_i_url}</TableCell>

                            <TableCell className={classes.tableCell}>
                              <Icon>{row.menu_i_icon}</Icon>
                            </TableCell>

                            <TableCell className={classes.tableCell}>
                              <Icon
                                className={
                                  row.menu_i_children === 1
                                    ? classes.green
                                    : classes.red
                                }
                              >
                                {row.menu_i_children === 1 ? 'check' : 'close'}
                              </Icon>
                            </TableCell>

                            <TableCell className={classes.tableCell}>{row.created_at}</TableCell>
                            <TableCell className={classes.tableCell}>{row.updated_at}</TableCell>

                            {props.state !== null && (
                              props.state.update === 1 || props.state.delete === 1
                                ? (
                                  <TableCell align='center' className={classes.tableCell}>
                                    {props.state.update === 1 && (
                                      <CustomTooltip title='Update'>
                                        <IconButton
                                          aria-label='Update'
                                          onClick={() => props.openDialogEdit(row)}
                                        >
                                          <EditIcon fontSize='small' />
                                        </IconButton>
                                      </CustomTooltip>
                                    )}

                                    {props.state.delete === 1 && (
                                      <CustomTooltip title='Delete'>
                                        <IconButton
                                          aria-label='delete'
                                          onClick={() => props.openDialogDelete(row.id)}
                                        >
                                          <DeleteIcon fontSize='small' />
                                        </IconButton>
                                      </CustomTooltip>
                                    )}
                                  </TableCell>
                                ) : (
                                  <TableCell />
                                )
                            )}
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
                count={rowData.menu_items.total}
                rowsPerPage={Number(rowData.menu_items.per_page)}
                page={rowData.menu_items.current_page - 1}
                onChangePage={e => e.preventDefault()}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Toast
        open={toast.show}
        handleClose={() => {
          setToast({
            show: false,
            type: toast.type,
            message: toast.message
          })
        }}
        type={toast.type}
        message={toast.message}
      />
    </>
  );
};


/**
 * Redux State
 */
function reduxState(state) {
  return {
    reduxTheme: state.theme,
  }
}


export default connect(reduxState, null)(MenuItemTable);
