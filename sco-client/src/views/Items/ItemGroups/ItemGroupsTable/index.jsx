import React from 'react';
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
import CustomTooltip from 'src/components/CustomTooltip';
import TheadActions from './TheadActions';
import Loader from 'src/components/Loader';
import { useDispatch, useSelector } from 'react-redux';

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
  const isMounted = React.useRef(true);
  const navigate = useNavigate();
  const classes = useStyles();

  /**
   * Redux state
   */
  const { itemGroups } = useSelector(state => state.itemGroupsReducer);
  const dispatch = useDispatch();

  /**
   * State
   */
  const [selected, setSelected] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  /**
   * Jika data item groups pada redux bernilai null maka ambil data dari api.
   * handle jika komponen dilepas saat request api belum selesai.
   */
  React.useEffect(() => {
    if (itemGroups.data === null) getDataItemGroups();
    return () => {
      isMounted.current = false;
    };

    // eslint-disable-next-line
  }, []);

  /**
   * Fungsi untuk mengambil data item groups
   *
   * @param {Object} data
   */
  const getDataItemGroups = async (
    data = {
      page: 1, // halaman pada tabel
      perPage: 25, // jumah baris perhamalan pada tabel
      sort: 'item_g_code', // sortir tabel
      orderBy: 'asc', // urutan pada tabel secara ascending atau descending
      search: '' // pencarian pada tabel
    }
  ) => {
    setLoading(true);
    try {
      await dispatch(apiGetItemGroups(data));
      if (isMounted.current) setLoading(false);
    } catch (err) {
      if (isMounted.current) {
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
            dispatch({
              type: 'SET_TOAST',
              value: {
                show: true,
                type: 'error',
                message: `(#${err.status}) ${err.data.message}`
              }
            });
            break;
        }
      }
    }
  };

  /**
   * Hanlde sort table
   *
   * @param {string|field columns} sort
   */
  const handleSort = newSort => {
    let orderBy = 'asc';

    if (itemGroups.sort === newSort && itemGroups.orderBy === 'asc') {
      orderBy = 'desc';
    }

    getDataItemGroups({
      sort: newSort, // sort
      orderBy: orderBy, // orderBy
      page: itemGroups.currentPage, // page
      perPage: itemGroups.perPage, // perPage
      search: itemGroups.search // search
    });
  };

  /**
   * Fungsi untuk next atau prev halaman tabel
   * @param {*} e
   * @param {*} newPage
   */
  const handleChangePage = (e, newPage) => {
    getDataItemGroups({
      page: newPage + 1, // page
      perPage: itemGroups.perPage, // perPage
      sort: itemGroups.sort, // sort
      orderBy: itemGroups.orderBy, // orderBy
      search: itemGroups.search // search
    });
  };

  /**
   * Hanlde ketika jumlah baris per halaman di rubah
   *
   * @param {event} e
   */
  const handleChangeRowsPerPage = e => {
    getDataItemGroups({
      page: 1, // page
      perPage: e.target.value, // perPage
      sort: itemGroups.sort, // sort
      orderBy: itemGroups.orderBy, // orderBy
      search: itemGroups.search // search
    });
  };

  /**
   * Fungsi untuk reload table
   */
  const handleReloadTable = () => {
    getDataItemGroups({ ...itemGroups });
  };

  /**
   * Fungsi untuk pencarian table
   */
  const handleSearch = value => {
    let newItemGroups = { ...itemGroups };
    newItemGroups['search'] = value;
    newItemGroups['currenPage'] = 1;

    getDataItemGroups(newItemGroups);
  };

  /**
   * Fungsi select semua checkbox
   *
   * @param {obj} event
   */
  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = itemGroups.data.map(value => value.id);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };

  /**
   * Handle slected rows saat dialog delete di tutup
   */
  React.useEffect(() => {
    setSelected(props.selectedRows);
  }, [props.selectedRows, setSelected]);

  /**
   * Fungsi untuk mengecek baris tabel yang terpilih
   *
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
   * Render komponen utama
   */
  return (
    <Card className={classes.root} elevation={3}>
      <CardContent>
        <TheadActions
          selected={selected}
          loading={loading}
          userAccess={props.userAccess}
          onReload={handleReloadTable}
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
                          onChange={handleSelectAllClick}
                          indeterminate={Boolean(
                            selected.length > 0 &&
                              selected.length < itemGroups.data.length
                          )}
                          checked={Boolean(
                            itemGroups.data !== null &&
                              itemGroups.data.length > 0 &&
                              selected.length === itemGroups.data.length
                          )}
                        />
                      </CustomTooltip>
                    </TableCell>
                  )}

                  {columns.map((col, key) => (
                    <Thead
                      key={key}
                      column={col}
                      data={itemGroups}
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
                {itemGroups.data === null || itemGroups.data.length <= 0 ? (
                  <TableRow hover>
                    <TableCell
                      align="center"
                      colSpan={6}
                      className={classes.tableCell}
                      padding={
                        props.userAccess !== null &&
                        props.userAccess.user_m_s_i_delete === 1
                          ? 'checkbox'
                          : 'default'
                      }
                    >
                      {props.userAccess === null || loading
                        ? 'Loading...'
                        : 'No data in table'}
                    </TableCell>
                  </TableRow>
                ) : (
                  itemGroups.data.map((row, key) => {
                    const isItemSelected = isSelected(row.id);
                    return (
                      <Tbody
                        hover
                        role="checkbox"
                        color="primary"
                        key={key}
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
            count={itemGroups.totalData}
            rowsPerPage={itemGroups.perPage}
            page={itemGroups.currentPage - 1}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Loader>
      </CardContent>
    </Card>
  );
}

export default ItemGroupTable;
