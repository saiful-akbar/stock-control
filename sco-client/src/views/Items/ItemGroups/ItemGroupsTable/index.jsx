import React from 'react';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import { apiGetItemGroups } from 'src/services/itemGroups';
import {
  useNavigate,
  useLocation,
} from 'react-router-dom';
import {
  Card,
  CardContent,
  makeStyles,
  LinearProgress,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TablePagination,
  TableCell,
} from '@material-ui/core';
import Thead from './Thead';
import Tbody from './Tbody';
import TpaginationActions from './TpaginationActions';


/**
 * Style
 */
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  progress: {
    width: '100%',
    height: 4,
    margin: 0,
    padding: 0,
  },
  tableContainer: {
    minWidth: "100%",
    maxHeight: "60vh",
  },
}));


/**
 * Komponen utama
 */
function ItemGroupTable(props) {
  const is_mounted = React.useRef(true);
  const navigate = useNavigate();
  const classes = useStyles();
  const location = useLocation();


  React.useEffect(() => {
    console.log('ItemGroupTable', location);
  }, [location]);


  /**
   * State
   */
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
   * Hendel jika komponen dilepas saat request api belum selesai
   */
  React.useEffect(() => {
    row_data.item_groups.data.length === 0 && getData();
    return () => {
      is_mounted.current = false;
    }
    // eslint-disable-next-line
  }, []);


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
        setLoading(false);
        setRowData(res.data);
      }
    } catch (err) {
      if (is_mounted.current) {
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
      row_data.item_groups.current_page, // page
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
      new_page + 1, // page
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
      1, // page
      e.target.value, // per_page
      row_data.sort, // sort
      row_data.order_by, // order_by
      row_data.search, // searrch
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
      {loading
        ? <LinearProgress className={classes.progress} />
        : <div className={classes.progress} />
      }

      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
          </Grid>
        </Grid>

        <TableContainer className={classes.tableContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((col, key) => (
                  <Thead
                    key={key}
                    column={col}
                    data={row_data}
                    onSort={field => handleSort(field)}
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
                          ? 'Loading, please wait...'
                          : 'No data in table'
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  row_data.item_groups.data.map((row, key) => (
                    <Tbody
                      key={key}
                      row={row}
                      columns={columns}
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
          count={row_data.item_groups.total}
          rowsPerPage={Number(row_data.item_groups.per_page)}
          page={row_data.item_groups.current_page - 1}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          ActionsComponent={TpaginationActions}
        />
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