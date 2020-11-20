import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
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

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 400,
  },
});

export default function UserCreateTable({ columns, rows, action, ...props }) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root} variant='outlined'>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell align='center'>No</TableCell>
              <TableCell align='center'>Delete</TableCell>
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
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowKey) => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={rowKey}>
                  <TableCell align='center'>{rowKey + 1}</TableCell>

                  <TableCell align='center'>
                    <CustomTooltip title='Delete' placement='bottom'>
                      <IconButton onClick={() => action(row.id)} >
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </CustomTooltip>
                  </TableCell>

                  {columns.map((column, colKey) => (
                    <TableCell key={colKey} align={column.align}>
                      {row[column.name]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
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
    </Paper>
  );
}

UserCreateTable.defaultProps = {
  columns: [],
  rows: [],
  action: null,
}
