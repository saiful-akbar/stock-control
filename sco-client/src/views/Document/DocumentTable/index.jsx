import React from 'react';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import { apiGetDocuments } from 'src/services/document';
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
import CustomTooltip from 'src/components/CustomTooltip';
import Loader from 'src/components/Loader';
import Thead from './Thead';
import Tbody from './Tbody';
import TpaginationActions from './TpaginationActions';
import TheadActions from './TheadActions';

/* Daftar nama kolom */
const columns = [
  {
    field: 'document_title',
    label: 'Title',
    align: 'left',
    sort: true
  },
  {
    field: 'document_description',
    label: 'Description',
    align: 'left',
    sort: true
  }
];

/* Style */
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

/* Komponen utama */
function DocumentTable(props) {
  const isMounted = React.useRef(true);
  const navigate = useNavigate();
  const classes = useStyles();

  /* State */
  const [selected, setSelected] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [rowData, setRowData] = React.useState({
    documents: {
      current_page: 1,
      data: [],
      first_page_url: null,
      from: 1,
      last_page: 1,
      last_page_url: null,
      links: [],
      next_page_url: null,
      path: null,
      per_page: 100,
      prev_page_url: null,
      to: 1,
      total: 1
    },
    page: null,
    sort: 'document_title',
    order_by: 'asc',
    search: ''
  });

  /**
   * FUngsi untuk Ambil data document saat halaman dimuat.
   * dan jika komponen dilepas saat request api belum selesai.
   */
  React.useEffect(() => {
    if (rowData.documents.data.length === 0) {
      getData();
    }

    return () => {
      isMounted.current = false;
    };

    // eslint-disable-next-line
  }, []);

  /* handle jika table di reload saat aksi sukses atau berhasil. */
  React.useEffect(() => {
    if (props.reload) {
      handleReload();
    }
    // eslint-disable-next-line
  }, [props.reload]);

  /* Handle slected rows, saat dialog delete di tutup */
  React.useEffect(() => {
    setSelected(props.selectedRows);
  }, [props.selectedRows, setSelected]);

  /**
   * Fungsi untuk mengambil data documents
   *
   * @param {integer} page
   * @param {integer} per_page
   * @param {string} sort
   * @param {string} order_by
   * @param {string} search
   */
  const getData = (
    page = 1, // page
    per_page = 25, // rows per page
    sort = 'item_g_code', // sortir
    order_by = 'asc', // order by
    search = '' // search
  ) => {
    setLoading(true);
    apiGetDocuments(page, per_page, sort, order_by, search)
      .then(res => {
        if (isMounted.current) {
          props.onReloadTable(false);
          setLoading(false);
          setRowData(res.data);
        }
      })
      .catch(err => {
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
   *
   * @param {string|field columns} sort
   */
  const handleSort = sort => {
    let orderBy = 'asc';
    if (rowData.sort === sort && rowData.order_by === 'asc') {
      orderBy = 'desc';
    }

    getData(
      rowData.documents.current_page, // current_page
      rowData.documents.per_page, // per_page
      sort, // sort
      orderBy, // order_by
      rowData.search // search
    );
  };

  /**
   * Hanlde ketika halaman di rubah
   *
   * @param {number} newPage
   */
  const handleChangePage = (e, newPage) => {
    getData(
      newPage + 1, // current_page
      rowData.documents.per_page, // per_page
      rowData.sort, // sort
      rowData.order_by, // order_by
      rowData.search // search
    );
  };

  /* Hanlde ketika jumlah baris per halaman di rubah */
  const handleChangeRowsPerPage = e => {
    const newData = { ...rowData };
    newData.documents['current_page'] = 1;
    newData.documents['per_page'] = e.target.value;
    setRowData(newData);
    getData(
      1, // current_page
      e.target.value, // per_page
      rowData.sort, // sort
      rowData.order_by, // order_by
      rowData.search // searrch
    );
  };

  /* Fungsi select semua checkbox */
  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rowData.documents.data.map(n => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

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
   *
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

  /* Fungsi untuk reload table */
  const handleReload = () => {
    getData(
      rowData.documents.current_page, // current_page
      rowData.documents.per_page, // per_page
      rowData.sort, // sort
      rowData.order_by, // order_by
      rowData.search // search
    );
  };

  /* Fungsi untuk pencarian table */
  const handleSearch = value => {
    getData(
      1, // current_page
      rowData.documents.per_page, // per_page
      rowData.sort, // sort
      rowData.order_by, // order_by
      value // search
    );
  };

  /* Render */
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
                              selected.length < rowData.documents.data.length
                          )}
                          checked={Boolean(
                            rowData.documents.data.length > 0 &&
                              selected.length === rowData.documents.data.length
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
                        Boolean(
                          props.userAccess !== null &&
                            props.userAccess.user_m_s_i_delete === 1
                        )
                          ? 'checkbox'
                          : 'default'
                      }
                    />
                  ))}

                  <TableCell padding="checkbox" />
                </TableRow>
              </TableHead>

              <TableBody>
                {Boolean(
                  rowData.documents.data.length === 0 ||
                    props.userAccess === null
                ) ? (
                  <TableRow hover>
                    <TableCell
                      align="center"
                      colSpan={5}
                      className={classes.tableCell}
                      padding={
                        props.userAccess !== null &&
                        props.userAccess.user_m_s_i_delete === 1
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
                  rowData.documents.data.map((row, key) => {
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
                        onEdit={data => props.onEdit(data)}
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
            count={rowData.documents.total}
            rowsPerPage={Number(rowData.documents.per_page)}
            page={rowData.documents.current_page - 1}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            ActionsComponent={TpaginationActions}
          />
        </Loader>
      </CardContent>
    </Card>
  );
}

/* Default props untuk komponent DocumentTable */
DocumentTable.defaultProps = {
  onReloadTable: e => {}
};

/* Redux dispatch */
function reduxReducer(dispatch) {
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

export default connect(null, reduxReducer)(DocumentTable);
