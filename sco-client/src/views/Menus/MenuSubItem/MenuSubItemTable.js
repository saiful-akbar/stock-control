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
import CustomTooltip from 'src/components/CustomTooltip';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { apiGetAllMenuSubItem } from 'src/services/menuSubItem';
import { useNavigate } from 'react-router-dom';
import Loader from 'src/components/Loader';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import Icon from '@material-ui/core/Icon';
import { useSelector, useDispatch } from 'react-redux';

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
  },
  tableCellDense: {
    paddingTop: 0,
    paddingBottom: 0
  }
}));

/**
 * component utama
 */
const MenuSubItemTable = props => {
  const classes = useStyles();
  const isMounted = useRef(true);
  const navigate = useNavigate();

  /**
   * Redux
   */
  const { menuSubItems } = useSelector(state => state.menusReducer);
  const dispatch = useDispatch();

  /**
   * state
   */
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(menuSubItems.search);

  /**
   * daftar kolom untuk tabel
   */
  const columns = [
    { field: 'menu_i_title', label: 'Menus Title', align: 'left' },
    { field: 'menu_s_i_title', label: 'Sub Menus Title', align: 'left' },
    { field: 'menu_s_i_icon', label: 'Icon', align: 'left' },
    { field: 'menu_s_i_url', label: 'Path', align: 'left' },
    { field: 'created_at', label: 'Created At', align: 'left' },
    { field: 'updated_at', label: 'Updated At', align: 'left' }
  ];

  /**
   * Mengambil data menu sub items untuk pertama saat komponen dipasang
   */
  useEffect(() => {
    if (menuSubItems.data === null) getDataMenuSubItems();

    // eslint-disable-next-line
  }, [menuSubItems]);

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
   */
  const getDataMenuSubItems = (
    data = {
      page: 1, // halaman pada tabel
      perPage: 25, // baris perhalaman pada atabel
      sort: 'menu_i_title', // sortir tabel
      orderBy: 'asc', // urutan table asc || desc
      search: '' // pencarian pada tabel
    }
  ) => {
    setLoading(true);
    dispatch(apiGetAllMenuSubItem(data))
      .then(() => {
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
   */
  const handleSortTable = sort => {
    let orderBy = 'asc';
    if (menuSubItems.sort === sort && menuSubItems.orderBy === 'asc') {
      orderBy = 'desc';
    }

    getDataMenuSubItems({
      page: menuSubItems.currentPage,
      perPage: menuSubItems.perPage,
      sort: sort,
      orderBy: orderBy,
      search: menuSubItems.search
    });
  };

  /**
   * fungsi submit form pencarian
   */
  const handleSubmitSearch = e => {
    e.preventDefault();
    getDataMenuSubItems({
      page: 1,
      search: search,
      perPage: menuSubItems.perPage,
      sort: menuSubItems.sort,
      orderBy: menuSubItems.orderBy
    });
  };

  /**
   * fungsi handle blur pada form pencarian
   */
  const handleBlurFormSearch = e => {
    e.preventDefault();
    if (menuSubItems.search !== search) handleSubmitSearch(e);
  };

  /**
   * Handle clear form search
   */
  const handleClearSearch = e => {
    setSearch('');
    getDataMenuSubItems({
      page: menuSubItems.currentPage,
      perPage: menuSubItems.perPage,
      sort: menuSubItems.sort,
      orderBy: menuSubItems.orderBy,
      search: ''
    });
  };

  /**
   * fungsi handle refresh pada table
   */
  const handleReloadTable = () => {
    getDataMenuSubItems({
      page: menuSubItems.currentPage,
      perPage: menuSubItems.perPage,
      sort: menuSubItems.sort,
      orderBy: menuSubItems.orderBy,
      search: menuSubItems.search
    });
  };

  /**
   * fungsi untuk merubah baris perhalaman pada tabel
   */
  const handleChangeRowsPerPage = event => {
    getDataMenuSubItems({
      page: 1,
      perPage: event.target.value,
      sort: menuSubItems.sort,
      orderBy: menuSubItems.orderBy,
      search: menuSubItems.search
    });
  };

  /**
   * fungsi untuk kembali 1 halaman sebelumnya
   * @param {object} event
   */
  const handleChangePage = (e, newPage) => {
    getDataMenuSubItems({
      page: newPage + 1,
      perPage: menuSubItems.perPage,
      sort: menuSubItems.sort,
      orderBy: menuSubItems.orderBy,
      search: menuSubItems.search
    });
  };

  // render component utaman
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

              {props.state !== null && props.state.create === 1 && (
                <Button
                  fullWidth
                  color="primary"
                  variant="contained"
                  onClick={() => props.openDialogForm(true, 'Create', null)}
                >
                  {'Create a new sub menu'}
                </Button>
              )}
            </Box>
          </Grid>

          <Grid item md={8} sm={6} xs={12}>
            <form autoComplete="off" onSubmit={handleSubmitSearch}>
              <TextField
                fullWidth
                placeholder="Search sub menus"
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
                  endAdornment: menuSubItems.search !== '' && (
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
                            active={menuSubItems.sort === col.field}
                            onClick={() => handleSortTable(col.field)}
                            direction={
                              menuSubItems.sort === col.field
                                ? menuSubItems.orderBy
                                : 'asc'
                            }
                          >
                            {col.label}
                            {menuSubItems.sort === col.field ? (
                              <span className={classes.visuallyHidden}>
                                {menuSubItems.orderBy === 'desc'
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
                    {menuSubItems.data === null ||
                    menuSubItems.data.length <= 0 ? (
                      <TableRow hover>
                        <TableCell
                          colSpan={7}
                          align="center"
                          className={classes.tableCell}
                        >
                          {loading ? 'Loading...' : 'No data in table'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      menuSubItems.data.map((row, key) => (
                        <TableRow hover key={key}>
                          {columns.map((col, colKey) => (
                            <TableCell
                              key={colKey}
                              align={col.align}
                              className={
                                props.state !== null &&
                                Boolean(
                                  props.state.update === 1 ||
                                    props.state.delete === 1
                                )
                                  ? classes.tableCellDense
                                  : classes.tableCell
                              }
                            >
                              {col.field === 'menu_s_i_icon' ? (
                                <Icon fontSize="small">{row[col.field]}</Icon>
                              ) : (
                                row[col.field]
                              )}
                            </TableCell>
                          ))}

                          {props.state !== null &&
                          Boolean(
                            props.state.update === 1 || props.state.delete === 1
                          ) ? (
                            <TableCell
                              align="center"
                              className={
                                props.state !== null &&
                                Boolean(
                                  props.state.update === 1 ||
                                    props.state.delete === 1
                                )
                                  ? classes.tableCellDense
                                  : classes.tableCell
                              }
                            >
                              {props.state.update === 1 && (
                                <CustomTooltip title="Edit">
                                  <IconButton
                                    onClick={() =>
                                      props.openDialogForm(true, 'Edit', row)
                                    }
                                  >
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </CustomTooltip>
                              )}

                              {props.state.delete === 1 && (
                                <CustomTooltip title="Delete">
                                  <IconButton
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
                count={menuSubItems.totalData}
                rowsPerPage={menuSubItems.perPage}
                page={menuSubItems.currentPage - 1}
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

export default MenuSubItemTable;
