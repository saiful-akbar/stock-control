import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import CustomTooltip from 'src/components/CustomTooltip';
import { makeStyles, lighten } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  Checkbox,
  Toolbar,
  Typography
} from '@material-ui/core';
import clsx from 'clsx';
import Loader from 'src/components/Loader';

/**
 * Style untuk komponen EnhancedTableToolbar
 */
const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  title: {
    flex: '1 1 100%'
  }
}));

/**
 * Komponent toolbar pada tabel
 * @param {*} props
 */
const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { numSelected, label, rows } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: Boolean(numSelected > 0 && numSelected <= rows)
      })}
    >
      {Boolean(numSelected > 0 && numSelected <= rows) ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {label}
        </Typography>
      )}

      {Boolean(numSelected > 0 && numSelected <= rows) && (
        <CustomTooltip title="Delete" placement="bottom">
          <IconButton aria-label="delete" onClick={() => props.onDelete()}>
            <DeleteOutlinedIcon />
          </IconButton>
        </CustomTooltip>
      )}
    </Toolbar>
  );
};

/**
 * Tipe props EnhancedTableToolbar
 */
EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  rows: PropTypes.number.isRequired,
  label: PropTypes.string,
  onDelete: PropTypes.func
};

/**
 * Style untuk komponen UserMenuTable
 */
const useStylesUserMenuTable = makeStyles({
  container: {
    maxHeight: 500
  },
  tableAction: {
    display: 'none'
  }
});

/**
 * Komponen utama
 * @param {*} param0
 */
function UserMenuTable({
  label,
  columns,
  rows,
  loading,
  action,
  onDelete,
  selectedRows,
  ...props
}) {
  const classes = useStylesUserMenuTable();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [selected, setSelected] = React.useState([]);

  React.useEffect(() => {
    setSelected(selectedRows);
  }, [selectedRows, setSelected]);

  /**
   * fungsi untuk menhendel perpindahan halaman
   * @param {obj} event
   * @param {int} newPage
   */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  /**
   * Fungsi untuk menghendel jumlah baris per halaman
   * @param {obj} event
   */
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  /**
   * FUngsi select semua checkbox
   * @param {obj} event
   */
  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  /**
   * Fungsi select checkbox
   * @param {obj} event
   * @param {string uuid} id
   */
  const handleClick = (event, id) => {
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
   * Fungsi untuk mengecek baris tabel yang terpilih
   * @param {string} id
   */
  const isSelected = id => {
    return selected.indexOf(id) !== -1;
  };

  /**
   * Komponen utam untuk di render
   */
  return (
    <Card className={classes.root} variant="elevation" elevation={3}>
      <CardContent>
        <EnhancedTableToolbar
          numSelected={selected.length}
          rows={rows.length}
          label={label}
          onDelete={() => onDelete(selected)}
        />

        <Loader show={loading}>
          <TableContainer className={classes.container}>
            <Table>
              <TableHead>
                <TableRow>
                  {action && (
                    <TableCell padding="checkbox">
                      <CustomTooltip
                        placement="bottom"
                        title={
                          selected.length === rows.length
                            ? 'Unselect all'
                            : 'Select all'
                        }
                      >
                        <Checkbox
                          color="primary"
                          indeterminate={Boolean(
                            selected.length > 0 && selected.length < rows.length
                          )}
                          checked={Boolean(
                            rows.length > 0 && selected.length === rows.length
                          )}
                          onChange={handleSelectAllClick}
                          inputProps={{ 'aria-label': 'select all desserts' }}
                        />
                      </CustomTooltip>
                    </TableCell>
                  )}

                  {columns.map((column, key) => (
                    <TableCell
                      padding="checkbox"
                      key={key}
                      align={column.align}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.length === 0 ? (
                  <TableRow hover>
                    <TableCell
                      align="center"
                      colSpan={action ? columns.length + 2 : columns.length}
                    >
                      {loading ? 'Loading...' : 'No data in table'}
                    </TableCell>
                  </TableRow>
                ) : (
                  rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(row => {
                      const isItemSelected = isSelected(row.id);
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          color="primary"
                          tabIndex={-1}
                          aria-checked={isItemSelected}
                          key={row.id}
                          selected={isItemSelected}
                        >
                          {action && (
                            <TableCell padding="checkbox">
                              <CustomTooltip title="Select" placement="bottom">
                                <Checkbox
                                  color="primary"
                                  checked={isItemSelected}
                                  onClick={event => handleClick(event, row.id)}
                                />
                              </CustomTooltip>
                            </TableCell>
                          )}

                          {columns.map((column, colKey) => (
                            <TableCell
                              padding="checkbox"
                              key={colKey}
                              align={column.align}
                            >
                              {row[column.field]}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[25, 50, 100, 250]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Loader>
      </CardContent>
    </Card>
  );
}

/**
 * Default props komponen UserMenuTable
 */
UserMenuTable.defaultProps = {
  label: 'List of data',
  columns: [],
  rows: [],
  loading: true,
  selectedRows: [],
  onDelete: () => null
};

/**
 * Tipe properti komponen UserMenuTable
 */
UserMenuTable.propTypes = {
  label: PropTypes.string,
  columns: PropTypes.array,
  rows: PropTypes.array,
  selectedRows: PropTypes.array,
  loading: PropTypes.bool,
  action: PropTypes.bool,
  onDelete: PropTypes.func
};

export default UserMenuTable;
