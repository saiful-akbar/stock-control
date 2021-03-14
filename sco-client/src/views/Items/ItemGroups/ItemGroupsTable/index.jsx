import React from 'react';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import { apiGetItemGroups } from 'src/services/itemGroups';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  makeStyles,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TablePagination,
  TableCell,
  Checkbox
} from '@material-ui/core';
import Thead from './Thead';
import Tbody from './Tbody';
import TpaginationActions from './TpaginationActions';
import CustomTooltip from 'src/components/CustomTooltip';
import TheadActions from './TheadActions';
import Loader from 'src/components/Loader';

/**
 * Daftar kolom untuk tabel
 */
const columns = [
  {
    field: 'item_g_code',
    label: 'Groups Code',
    align: 'left'
  },
  {
    field: 'item_g_name',
    label: 'Groups Name',
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
 * Style
 */
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  tableContainer: {
    minWidth: '100%',
    maxHeight: '70vh'
  },
  tableCell: {
    padding: 10
  }
}));

/**
 * Komponen utama
 */
function ItemGroupTable(props) {
  const is_mounted = React.useRef(true);
  const navigate = useNavigate();
  const classes = useStyles();

  /**
   * State
   */
  const [selected, setSelected] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [rowData, setRowData] = React.useState({
    item_groups: {
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
      prev_page_url: null
    },
    sort: 'item_g_code',
    order_by: 'asc',
    search: ''
  });

  /**
   * handle mengambil data item group untuk pertama kalinya.
   * handle jika table di reload saat aksi sukses atau berhasil.
   * handle jika komponen dilepas saat request api belum selesai.
   */
  React.useEffect(() => {
    if (rowData.item_groups.data.length === 0) {
      getData();
    }

    return () => {
      is_mounted.current = false;
    };

    // eslint-disable-next-line
  }, []);

  /**
   * handle jika table di reload saat aksi sukses atau berhasil.
   */
  React.useEffect(() => {
    if (props.reload) {
      handleReload();
    }
    // eslint-disable-next-line
  }, [props.reload]);

  /**
   * Handle slected rows saat dialog delete di tutup
   */
  React.useEffect(() => {
    setSelected(props.selectedRows);
  }, [props.selectedRows, setSelected]);

  /**
   * Fungsi untuk mengambil data item groups
   *
   * @param {integer} page
   * @param {integer} per_page
   * @param {string} sort
   * @param {string} order_by
   * @param {string} search
   */
  const getData = (
    page = 1, // halaman pada tabel
    per_page = 25, // jumah baris perhamalan pada tabel
    sort = 'item_g_code', // sortir tabel
    order_by = 'asc', // urutan pada tabel secara ascending atau descending
    search = '' // pencarian pada tabel
  ) => {
    setLoading(true);
    apiGetItemGroups(page, per_page, sort, order_by, search)
      .then(res => {
        if (is_mounted.current) {
          props.onReloadTable(false);
          setLoading(false);
          setRowData(res.data);
        }
      })
      .catch(err => {
        if (is_mounted.current) {
          switch (err.status) {
            case 401:
              navigate('/logout');
              break;

            case 403:
              navigate('/error/forbiden');
              break;

            case 404:
              navigate('/error/notfound');
              break;

            default:
              setLoading(false);
              props.onReloadTable(false);
              props.setReduxToast(
                true,
                'error',
                `(#${err.status}) ${err.data.message}`
              );
              break;
          }
        }
      });
  };

  /**
   * Hanlde sort table
   * @param {string|field columns} sort
   */
  const handleSort = sort => {
    let order_by = 'asc';
    if (rowData.sort === sort && rowData.order_by === 'asc') {
      order_by = 'desc';
    }

    getData(
      rowData.item_groups.current_page, // current_page
      rowData.item_groups.per_page, // per_page
      sort, // sort
      order_by, // order_by
      rowData.search // search
    );
  };

  /**
   * Hanlde ketika halaman di rubah
   */
  const handleChangePage = (e, new_page) => {
    getData(
      new_page + 1, // current_page
      rowData.item_groups.per_page, // per_page
      rowData.sort, // sort
      rowData.order_by, // order_by
      rowData.search // search
    );
  };

  /**
   * Hanlde ketika jumlah baris per halaman di rubah
   */
  const handleChangeRowsPerPage = e => {
    const new_data = { ...rowData };
    new_data.item_groups['current_page'] = 1;
    new_data.item_groups['per_page'] = e.target.value;
    setRowData(new_data);
    getData(
      1, // current_page
      e.target.value, // per_page
      rowData.sort, // sort
      rowData.order_by, // order_by
      rowData.search // searrch
    );
  };

  /**
   * Fungsi select semua checkbox
   *
   * @param {obj} event
   */
  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rowData.item_groups.data.map(n => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  /**
   * Fungsi untuk mengecek baris tabel yang terpilih
   * @param {string} id
   */
  const isSelected = id => {
    return selected.indexOf(id) !== -1;
  };

  /**
   * Fungsi select checkbox
   * @param {obj} event
   * @param {string uuid} id
   */
  const handleSelectClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  /**
   * Fungsi untuk reload table
   */
  const handleReload = () => {
    getData(
      rowData.item_groups.current_page, // current_page
      rowData.item_groups.per_page, // per_page
      rowData.sort, // sort
      rowData.order_by, // order_by
      rowData.search // search
    );
  };

  /**
   * Fungsi untuk pencarian table
   */
  const handleSearch = value => {
    getData(
      1, // current_page
      rowData.item_groups.per_page, // per_page
      rowData.sort, // sort
      rowData.order_by, // order_by
      value // search
    );
  };

  /**
   * Render komponen utama
   */
  return (
    <Card className={classes.root} elevation={3} variant="elevation">
      <CardContent>
        <TheadActions
          selected={selected}
          searchValue={rowData.search}
          loading={loading}
          userAccess={props.userAccess}
          onReload={handleReload}
          onSearch={value => handleSearch(value)}
          onAdd={() => props.onAdd()}
          onDelete={() => props.onDelete(selected)}
          onImport={() => props.onImport()}
        />

        <Loader show={Boolean(props.userAccess === null || loading)}>
          <TableContainer className={classes.tableContainer}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {Boolean(
                    props.userAccess !== null &&
                      props.userAccess.user_m_s_i_delete === 1
                  ) && (
                    <TableCell padding="checkbox">
                      <CustomTooltip placement="bottom" title="Select">
                        <Checkbox
                          color="primary"
                          indeterminate={Boolean(
                            selected.length > 0 &&
                              selected.length < rowData.item_groups.data.length
                          )}
                          checked={Boolean(
                            rowData.item_groups.data.length > 0 &&
                              selected.length ===
                                rowData.item_groups.data.length
                          )}
                          inputProps={{
                            'aria-label': 'select all desserts'
                          }}
                          onChange={handleSelectAllClick}
                        />
                      </CustomTooltip>
                    </TableCell>
                  )}

                  {columns.map((col, key) => (
                    <Thead
                      key={key}
                      column={col}
                      data={rowData}
                      onSort={field => handleSort(field)}
                      className={classes.tableCell}
                      padding={
                        props.userAccess !== null &&
                        props.userAccess.user_m_s_i_delete === 1
                          ? 'checkbox'
                          : 'default'
                      }
                    />
                  ))}

                  {Boolean(
                    props.userAccess !== null &&
                      Boolean(
                        props.userAccess.user_m_s_i_delete === 1 ||
                          props.userAccess.user_m_s_i_update === 1
                      )
                  ) && <TableCell padding="checkbox" />}
                </TableRow>
              </TableHead>

              <TableBody>
                {Boolean(
                  rowData.item_groups.data.length === 0 ||
                    props.userAccess === null
                ) ? (
                  <TableRow hover>
                    <TableCell
                      align="center"
                      colSpan={6}
                      className={classes.tableCell}
                      padding={
                        Boolean(
                          props.userAccess !== null &&
                            props.userAccess.user_m_s_i_delete === 1
                        )
                          ? 'checkbox'
                          : 'default'
                      }
                    >
                      {Boolean(props.userAccess === null || loading)
                        ? 'Loading...'
                        : 'No data in table'}
                    </TableCell>
                  </TableRow>
                ) : (
                  rowData.item_groups.data.map((row, key) => {
                    const isItemSelected = isSelected(row.id);
                    return (
                      <Tbody
                        hover
                        key={key}
                        role="checkbox"
                        color="primary"
                        row={row}
                        columns={columns}
                        userAccess={props.userAccess}
                        onEdit={value => props.onEdit(value)}
                        onSelect={(e, id) => handleSelectClick(e, id)}
                        aria-checked={isItemSelected}
                        selected={isItemSelected}
                        tabIndex={-1}
                      />
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            rowsPerPageOptions={[25, 50, 100, 250]}
            count={rowData.item_groups.total}
            rowsPerPage={Number(rowData.item_groups.per_page)}
            page={rowData.item_groups.current_page - 1}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            ActionsComponent={TpaginationActions}
          />
        </Loader>
      </CardContent>
    </Card>
  );
}

/**
 * Redux dispatch
 */
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

export default connect(null, reduxDispatch)(ItemGroupTable);
