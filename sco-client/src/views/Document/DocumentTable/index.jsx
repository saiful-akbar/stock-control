import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  },
  {
    field: 'created_at',
    label: 'Created At',
    align: 'left',
    sort: true
  },
  {
    field: 'updated_at',
    label: 'Updated At',
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

  /**
   * Redux
   */
  const dispatch = useDispatch();
  const { documents } = useSelector(state => state.documentsReducer);

  /* State */
  const [selected, setSelected] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  /**
   * FUngsi untuk Ambil data document saat halaman dimuat.
   * dan jika komponen dilepas saat request api belum selesai.
   */
  React.useEffect(() => {
    if (documents.data === null) getDataDocuments();
    return () => {
      isMounted.current = false;
    };

    // eslint-disable-next-line
  }, []);

  /**
   * Fungsi untuk mengambil data documents
   *
   * @param {integer} page
   * @param {integer} perPage
   * @param {string} sort
   * @param {string} orderBy
   * @param {string} search
   */
  const getDataDocuments = async (
    data = {
      page: 1, // page
      perPage: 25, // rows per page
      sort: 'document_title', // sortir
      orderBy: 'asc', // order by
      search: '' // search
    }
  ) => {
    setLoading(true);
    try {
      await dispatch(apiGetDocuments(data));
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
  const handleSort = sort => {
    let orderBy = 'asc';
    if (documents.sort === sort && documents.orderBy === 'asc') {
      orderBy = 'desc';
    }

    getDataDocuments({
      sort: sort, // sort
      orderBy: orderBy, // orderBy
      page: documents.currentPage, // currentPage
      perPage: documents.perPage, // perPage
      search: documents.search // search
    });
  };

  /**
   * Hanlde ketika halaman di rubah
   *
   * @param {number} newPage
   */
  const handleChangePage = (e, newPage) => {
    e.preventDefault();
    getDataDocuments({
      page: newPage + 1, // currentPage
      perPage: documents.perPage, // perPage
      sort: documents.sort, // sort
      orderBy: documents.orderBy, // orderBy
      search: documents.search // search
    });
  };

  /* Hanlde ketika jumlah baris per halaman di rubah */
  const handleChangeRowsPerPage = e => {
    const newDocuments = { ...documents };
    newDocuments['currentPage'] = 1;
    newDocuments['perPage'] = e.target.value;
    getDataDocuments(newDocuments);
  };

  /* Handle slected rows, saat dialog delete di tutup */
  React.useEffect(() => {
    setSelected(props.selectedRows);
  }, [props.selectedRows, setSelected]);

  /* Fungsi select semua checkbox */
  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = documents.data.map(row => row.id);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
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

  /**
   * Fungsi untuk reload table
   */
  const handleReload = () => {
    getDataDocuments({ ...documents });
  };

  /* Fungsi untuk pencarian table */
  const handleSearch = value => {
    const newDocuments = { ...documents };
    newDocuments['currentPage'] = 1;
    newDocuments['search'] = value;
    getDataDocuments(newDocuments);
  };

  /* Render */
  return (
    <Card className={classes.root} elevation={3}>
      <CardContent>
        <TheadActions
          selected={selected}
          loading={loading}
          userAccess={props.userAccess}
          onReload={handleReload}
          onSearch={value => handleSearch(value)}
          onAdd={() => props.onAdd()}
          onDelete={() => props.onDelete(selected)}
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
                              selected.length < documents.data.length
                          )}
                          checked={Boolean(
                            documents.data !== null &&
                              documents.data.length > 0 &&
                              selected.length === documents.data.length
                          )}
                        />
                      </CustomTooltip>
                    </TableCell>
                  )}

                  {columns.map((col, key) => (
                    <Thead
                      key={key}
                      column={col}
                      data={documents}
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
                  <TableCell padding="checkbox" />
                </TableRow>
              </TableHead>

              <TableBody>
                {documents.data === null || documents.data.length <= 0 ? (
                  <TableRow hover>
                    <TableCell
                      align="center"
                      className={classes.tableCell}
                      colSpan={
                        props.userAccess !== null &&
                        props.userAccess.user_m_s_i_delete === 1
                          ? 6
                          : 5
                      }
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
                  documents.data.map((row, key) => {
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
            count={documents.totalData}
            rowsPerPage={documents.perPage}
            page={documents.currentPage - 1}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Loader>
      </CardContent>
    </Card>
  );
}

export default DocumentTable;
