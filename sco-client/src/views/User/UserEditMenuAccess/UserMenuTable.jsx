import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CustomTooltip from 'src/components/CustomTooltip';
import Progress from 'src/components/Progress';
import { Card, CardContent } from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    maxHeight: '100%',
  },
});

function UserMenuTable({ columns, rows, onDelete, loading, ...props }) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);


  // fungsi untuk menhendel perpindahan halaman
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  // Fungsi untuk menghendel jumlah baris per halaman
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  // Komponen utam untuk di render
  return (
    <Card className={classes.root} elevation={3}>
      <Progress show={loading} />
      <CardContent>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                <TableCell>
                  <IconButton disabled>
                    <DeleteIcon fontSize='small' />
                  </IconButton>
                </TableCell>
                {columns.map((column, key) => (
                  <TableCell
                    key={key}
                    align={column.align}
                    style={{ minWidth: 50 }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.length === 0
                ? (
                  <TableRow hover>
                    <TableCell align='center' colSpan={columns.length + 1}>
                      {loading ? 'Loading, pelase wait...' : 'No data in table'}
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowKey) => (
                    <TableRow hover tabIndex={-1} key={rowKey}>
                      <TableCell>
                        <CustomTooltip title='Delete' placement='bottom'>
                          <IconButton onClick={() => onDelete(row.id)} >
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </CustomTooltip>
                      </TableCell>

                      {columns.map((column, colKey) => (
                        <TableCell key={colKey} align={column.align}>
                          {row[column.field]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </CardContent>
    </Card>
  );
}

UserMenuTable.defaultProps = {
  columns: [],
  rows: [],
  loading: true,
  onDelete: () => null,
}

export default UserMenuTable;
