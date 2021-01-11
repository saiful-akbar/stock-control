import React from 'react';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import { apiGetItemGroups } from 'src/services/itemGroups';
import {
  useNavigate,
} from 'react-router-dom';
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
  Checkbox,
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
const columns = [{
  field: 'item_g_code',
  label: 'Groups Code',
  align: 'left'
}, {
  field: 'item_g_name',
  label: 'Groups Name',
  align: 'left'
}, {
  field: 'created_at',
  label: 'Created At',
  align: 'left'
}, {
  field: 'updated_at',
  label: 'Updated At',
  align: 'left'
}];


/**
 * Style
 */
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  tableContainer: {
    minWidth: "100%",
    maxHeight: "60vh",
  },
  tableCell: {
    paddingBottom: 10,
    paddingTop: 10
  },
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
  const [row_data, setRowData] = React.useState({
    item_groups: {
      current_page: 1,
      from: 1,
      last_page: 0,
      per_page: 25,
      to: 0,
      total: 0,
      data: [],
      links: [],
      path: "",
      first_page_url: "",
      last_page_url: "",
      next_page_url: "",
      prev_page_url: null,
    },
    sort: "item_g_code",
    order_by: "asc",
    search: "",
  });


  /**
   * handle mengambil data item group untuk pertama kalinya.
   * handle jika table di reload saat aksi sukses atau berhasil.
   * handle jika komponen dilepas saat request api belum selesai.
   */
  React.useEffect(() => {
    if (row_data.item_groups.data.length === 0) {
      getData()
    }

    return () => {
      is_mounted.current = false;
    }

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
   * Fungsi untuk mengambil data item groups
   * 
   * @param {integer} page
   * @param {integer} per_page
   * @param {string} sort
   * @param {string} order_by
   * @param {string} search
   */
  const getData = async (
    page = 1,
    per_page = 25,
    sort = "item_g_code",
    order_by = "asc",
    search = "",
  ) => {
    setLoading(true);

    try {
      let res = await apiGetItemGroups(page, per_page, sort, order_by, search);
      if (is_mounted.current) {
        props.onReloadTable(false);
        setLoading(false);
        setRowData(res.data);
      }
    } catch (err) {
      if (is_mounted.current) {
        props.onReloadTable(false);
        setLoading(false);
        switch (err.status) {
          case 401:
            navigate("/logout");
            break;

          case 403:
            navigate("/error/forbiden");
            break;

          default:
            props.setReduxToast(true, "error", `(#${err.status}) ${err.data.message}`);
            break;
        }
      }
    }
  }


  /**
   * Hanlde sort table
   * @param {string|field columns} sort 
   */
  const handleSort = (sort) => {
    let order_by = 'asc';
    if (row_data.sort === sort && row_data.order_by === 'asc') {
      order_by = 'desc';
    }

    getData(
      row_data.item_groups.current_page, // current_page
      row_data.item_groups.per_page, // per_page
      sort, // sort
      order_by, // order_by
      row_data.search, // search
    );
  }


  /**
   * Hanlde ketika halaman di rubah
   */
  const handleChangePage = (e, new_page) => {
    getData(
      new_page + 1, // current_page
      row_data.item_groups.per_page, // per_page
      row_data.sort, // sort
      row_data.order_by, // order_by
      row_data.search, // search
    );
  }


  /**
   * Hanlde ketika jumlah baris per halaman di rubah
   */
  const handleChangeRowsPerPage = (e) => {
    const new_data = { ...row_data };
    new_data.item_groups['current_page'] = 1;
    new_data.item_groups['per_page'] = e.target.value;
    setRowData(new_data);
    getData(
      1, // current_page
      e.target.value, // per_page
      row_data.sort, // sort
      row_data.order_by, // order_by
      row_data.search, // searrch
    );
  }


  /**
   * Fungsi select semua checkbox
   * 
   * @param {obj} event 
   */
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = row_data.item_groups.data.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };


  /**
   * Fungsi untuk mengecek baris tabel yang terpilih
   * @param {string} id 
   */
  const isSelected = (id) => {
    return selected.indexOf(id) !== -1
  }


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
    }
    else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    }
    else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    }
    else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  }


  /**
   * Fungsi untuk reload table
   */
  const handleReload = () => {
    getData(
      row_data.item_groups.current_page, // current_page
      row_data.item_groups.per_page, // per_page
      row_data.sort, // sort
      row_data.order_by, // order_by
      row_data.search, // search
    );
  }


  /**
   * Fungsi untuk pencarian table
   */
  const handleSearch = (value) => {
    getData(
      1, // current_page
      row_data.item_groups.per_page, // per_page
      row_data.sort, // sort
      row_data.order_by, // order_by
      value, // search
    );
  }


  /**
   * Render komponen utama
   */
  return (
    <Card
      className={classes.root}
      elevation={3}
      variant={
        props.reduxTheme === "light"
          ? "elevation"
          : "outlined"
      }
    >
      <CardContent>
        <TheadActions
          selected={selected}
          onReload={handleReload}
          searchValue={row_data.search}
          loading={loading}
          userAccess={props.userAccess}
          onSearch={value => handleSearch(value)}
          onAdd={() => props.onAdd()}
        />

        <Loader show={loading}>
          <TableContainer className={classes.tableContainer}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {props.userAccess !== null && (
                    props.userAccess.user_m_s_i_delete === 1 || props.userAccess.user_m_s_i_update === 1
                      ? (
                        <TableCell padding='checkbox' >
                          {props.userAccess.user_m_s_i_delete === 1 && (
                            <CustomTooltip placement='bottom' title='Select' >
                              <Checkbox
                                color='primary'
                                indeterminate={Boolean(selected.length > 0 && selected.length < row_data.item_groups.data.length)}
                                checked={Boolean(row_data.item_groups.data.length > 0 && selected.length === row_data.item_groups.data.length)}
                                inputProps={{ 'aria-label': 'select all desserts' }}
                                onChange={handleSelectAllClick}
                              />
                            </CustomTooltip>
                          )}
                        </TableCell>
                      ) : null
                  )}

                  {columns.map((col, key) => (
                    <Thead
                      key={key}
                      column={col}
                      data={row_data}
                      onSort={field => handleSort(field)}
                      className={classes.tableCell}
                      padding={
                        props.userAccess !== null && props.userAccess.user_m_s_i_delete === 1
                          ? 'checkbox'
                          : 'default'
                      }
                    />
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {row_data.item_groups.data.length === 0
                  ? (
                    <TableRow hover >
                      <TableCell
                        align='center'
                        colSpan={6}
                      >
                        {
                          loading
                            ? 'Loading...'
                            : 'No data in table'
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    row_data.item_groups.data.map((row, key) => {
                      const isItemSelected = isSelected(row.id);
                      return (
                        <Tbody
                          hover
                          key={key}
                          role="checkbox"
                          color='primary'
                          row={row}
                          columns={columns}
                          userAccess={props.userAccess}
                          onEdit={(value) => props.onEdit(value)}
                          onSelect={(e, id) => handleSelectClick(e, id)}
                          aria-checked={isItemSelected}
                          selected={isItemSelected}
                          tabIndex={-1}
                        />
                      )
                    })
                  )
                }
              </TableBody>
            </Table>
          </TableContainer>


          <TablePagination
            component='div'
            rowsPerPageOptions={[25, 50, 100, 250]}
            count={row_data.item_groups.total}
            rowsPerPage={Number(row_data.item_groups.per_page)}
            page={row_data.item_groups.current_page - 1}
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
    setReduxToast: (show, type, message) => dispatch({
      type: reduxAction.toast,
      value: {
        show: show,
        type: type,
        message: message,
      }
    }),
  };
}


/**
 * Redux state
 */
function reduxState(state) {
  return {
    reduxTheme: state.theme,
  }
}


export default connect(reduxState, reduxDispatch)(ItemGroupTable);