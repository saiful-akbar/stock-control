import React, { useState, useEffect, useRef } from 'react';
import { Grid, Button, Card, CardContent, Box } from '@material-ui/core';
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
import { apiGetAllMenuItem } from 'src/services/menuItem';
import CustomTooltip from 'src/components/CustomTooltip';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import Loader from 'src/components/Loader';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

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
  red: {
    color: theme.palette.error.light
  },
  green: {
    color: theme.palette.success.light
  },
  tableCellDense: {
    paddingTop: 0,
    paddingBottom: 0
  },
  tableCell: {
    paddingTop: 10,
    paddingBottom: 10
  }
}));

/**
 * component utama
 * @param {*} props
 */
const MenuItemTable = props => {
  const classes = useStyles();
  const isMounted = useRef(true);
  const navigate = useNavigate();

  /**
   * Redux
   */
  const { menuItems } = useSelector(state => state.menusReducer);
  const dispatch = useDispatch();

  /**
   * State
   */
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(menuItems.search);

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
   * Pengamblan awal data menu items dari api jika redux menu items bernilai null
   */
  useEffect(() => {
    if (menuItems.data === null) getDataMenuItems();

    // eslint-disable-next-line
  }, [menuItems]);

  /**
   * Menghendel jika komponen dilepas saat request api belum selesai
   */
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  /**
   * Fungsi untuk mengambil data dari api
   * @param {int} page
   * @param {int} perPage
   * @param {string} querySearch
   * @param {string} sort
   * @param {'asc/desc'} orderBy
   */
  const getDataMenuItems = async (
    data = {
      page: 1, // halaman pada tabel
      perPage: 25, // baris perhalaman pada atabel
      sort: 'menu_i_title', // sortir tabel
      orderBy: 'asc', // urutan table asc || desc
      search: '' // pencarian pada tabel
    }
  ) => {
    setLoading(true);
    try {
      await dispatch(apiGetAllMenuItem(data));
      if (isMounted.current) setLoading(false);
    } catch (err) {
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
    }
  };

  /**
   * Fungsi untuk reload table
   */
  const handleReloadTable = () => {
    getDataMenuItems({
      page: menuItems.currentPage,
      perPage: menuItems.perPage,
      sort: menuItems.sort,
      orderBy: menuItems.orderBy,
      search: menuItems.search
    });
  };

  /**
   * fungsi sortir tabel
   * @param {string 'asc/desc'} sort
   */
  const handleSortTable = sort => {
    let orderBy = 'asc';
    if (menuItems.sort === sort && menuItems.orderBy === 'asc') {
      orderBy = 'desc';
    }

    getDataMenuItems({
      sort: sort,
      orderBy: orderBy,
      page: menuItems.currentPage,
      perPage: menuItems.perPage,
      search: menuItems.search
    });
  };

  /**
   * fungsi submit form pencarian
   * @param {obj} e
   */
  const handleSubmitSearch = e => {
    e.preventDefault();
    getDataMenuItems({
      page: 1,
      search: search,
      perPage: menuItems.perPage,
      sort: menuItems.sort,
      orderBy: menuItems.orderBy
    });
  };

  /**
   * fungsi handle blur pada form pencarian
   * @param {obj} e
   */
  const handleBlurFormSearch = e => {
    e.preventDefault();
    if (menuItems.search !== search) handleSubmitSearch(e);
  };

  /**
   * Handle clear form search
   */
  const handleClearSearch = e => {
    setSearch('');
    getDataMenuItems({
      page: menuItems.currentPage,
      perPage: menuItems.perPage,
      sort: menuItems.sort,
      orderBy: menuItems.orderBy,
      search: ''
    });
  };

  /**
   * fungsi untuk merubah baris perhalaman pada tabel
   * @param {obj} event
   */
  const handleChangeRowsPerPage = event => {
    getDataMenuItems({
      page: 1,
      perPage: event.target.value,
      sort: menuItems.sort,
      orderBy: menuItems.orderBy,
      search: menuItems.search
    });
  };

  /**
   * fungsi untuk kembali 1 halaman sebelumnya
   * @param {object} event
   */
  const handleChangePage = (e, newPage) => {
    getDataMenuItems({
      page: newPage + 1,
      perPage: menuItems.perPage,
      sort: menuItems.sort,
      orderBy: menuItems.orderBy,
      search: menuItems.search
    });
  };

  /**
   * render component utaman
   */
  return (
    <Card elevation={3}>
      <CardContent>
        <Grid
          spacing={3}
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item md={4} sm={6} xs={12}>
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              mt={0.5}
            >
              <Box mr={2}>
                <CustomTooltip title="Reload">
                  <IconButton onClick={handleReloadTable}>
                    <RefreshIcon />
                  </IconButton>
                </CustomTooltip>
              </Box>

              {Boolean(props.state !== null && props.state.create === 1) && (
                <Button
                  fullWidth
                  color="primary"
                  variant="contained"
                  onClick={() => props.openFormDialog(true, 'Create', null)}
                >
                  {'Create a new menu'}
                </Button>
              )}
            </Box>
          </Grid>

          <Grid item md={8} sm={6} xs={12}>
            <form autoComplete="off" onSubmit={handleSubmitSearch}>
              <TextField
                fullWidth
                placeholder="Search menus"
                variant="outlined"
                margin="dense"
                name="search"
                type="text"
                value={search}
                disabled={loading}
                onChange={e => setSearch(e.target.value)}
                onBlur={handleBlurFormSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: menuItems.search !== '' && (
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

          <Grid item xs={12}>
            <Loader show={Boolean(props.state === null || loading)}>
              <TableContainer className={classes.container}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {columns.map((col, i) => (
                        <TableCell
                          key={i}
                          className={classes.tableCell}
                          align={col.align}
                        >
                          <TableSortLabel
                            onClick={() => handleSortTable(col.field)}
                            active={Boolean(menuItems.sort === col.field)}
                            direction={
                              menuItems.sort === col.field
                                ? menuItems.orderBy
                                : 'asc'
                            }
                          >
                            {col.label}
                            {menuItems.sort === col.field ? (
                              <span className={classes.visuallyHidden}>
                                {menuItems.orderBy === 'desc'
                                  ? 'sorted descending'
                                  : 'sorted ascending'}
                              </span>
                            ) : null}
                          </TableSortLabel>
                        </TableCell>
                      ))}

                      <TableCell className={classes.tableCell} />
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {menuItems.data === null || menuItems.data.length <= 0 ? (
                      <TableRow hover>
                        <TableCell
                          colSpan={7}
                          align="center"
                          className={classes.tableCell}
                        >
                          {Boolean(props.state === null || loading)
                            ? 'Loading...'
                            : 'No data in table'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      menuItems.data.map((row, key) => (
                        <TableRow hover key={key}>
                          {columns.map((col, key) => (
                            <TableCell
                              key={key}
                              className={
                                Boolean(
                                  props.state !== null &&
                                    Boolean(
                                      props.state.update === 1 ||
                                        props.state.delete === 1
                                    )
                                )
                                  ? classes.tableCellDense
                                  : classes.tableCell
                              }
                            >
                              {row[col.field]}
                            </TableCell>
                          ))}

                          {props.state !== null &&
                          Boolean(
                            props.state.update === 1 || props.state.delete === 1
                          ) ? (
                            <TableCell
                              align="center"
                              className={
                                Boolean(
                                  props.state !== null &&
                                    Boolean(
                                      props.state.update === 1 ||
                                        props.state.delete === 1
                                    )
                                )
                                  ? classes.tableCellDense
                                  : classes.tableCell
                              }
                            >
                              {props.state.update === 1 && (
                                <CustomTooltip title="Edit">
                                  <IconButton
                                    onClick={() => {
                                      props.openFormDialog(true, 'Edit', row);
                                    }}
                                  >
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </CustomTooltip>
                              )}

                              {props.state.delete === 1 && (
                                <CustomTooltip title="Delete">
                                  <IconButton
                                    aria-label="delete"
                                    onClick={() =>
                                      props.openDialogDelete(row.id)
                                    }
                                  >
                                    <DeleteOutlineOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </CustomTooltip>
                              )}
                            </TableCell>
                          ) : (
                            <TableCell />
                          )}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                rowsPerPageOptions={[25, 50, 100, 250]}
                count={menuItems.totalData}
                rowsPerPage={Number(menuItems.perPage)}
                page={menuItems.currentPage - 1}
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

export default MenuItemTable;
