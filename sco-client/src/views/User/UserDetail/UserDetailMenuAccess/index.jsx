import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Card, CardContent, CardHeader } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

/**
 * Style
 */
const useStyles = makeStyles(theme => ({
  table: {
    minWidth: '100%'
  },
  tableCell: {
    padding: 10
  },
  textRed: {
    color: theme.palette.error.light
  },
  textGreen: {
    color: theme.palette.success.light
  }
}));

/**
 * Column
 */
const columns = [
  { field: 'menu_s_i_title', label: 'Title', align: 'left' },
  { field: 'read', label: 'Read', align: 'center' },
  { field: 'create', label: 'Create', align: 'center' },
  { field: 'update', label: 'Update', align: 'center' },
  { field: 'delete', label: 'Delete', align: 'center' }
];

/**
 * Komponent utama
 */
function UserDetailMenuAccess({ data }) {
  const classes = useStyles();
  return (
    <Card elevation={3}>
      <CardHeader title="Menu access & permission" />

      <CardContent>
        <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {columns.map((column, key) => (
                  <TableCell
                    className={classes.tableCell}
                    key={key}
                    align={column.align}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data === null ? (
                <TableRow>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    colSpan={5}
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data.length > 0 ? (
                data.map(subMenu => (
                  <TableRow key={subMenu.id}>
                    <TableCell className={classes.tableCell} align="left">
                      {subMenu.menu_s_i_title}
                    </TableCell>

                    <TableCell className={classes.tableCell} align="center">
                      {subMenu.read === 1 ? (
                        <CheckIcon className={classes.textGreen} />
                      ) : (
                        <CloseIcon className={classes.textRed} />
                      )}
                    </TableCell>

                    <TableCell className={classes.tableCell} align="center">
                      {subMenu.create === 1 ? (
                        <CheckIcon className={classes.textGreen} />
                      ) : (
                        <CloseIcon className={classes.textRed} />
                      )}
                    </TableCell>

                    <TableCell className={classes.tableCell} align="center">
                      {subMenu.update === 1 ? (
                        <CheckIcon className={classes.textGreen} />
                      ) : (
                        <CloseIcon className={classes.textRed} />
                      )}
                    </TableCell>

                    <TableCell className={classes.tableCell} align="center">
                      {subMenu.delete === 1 ? (
                        <CheckIcon className={classes.textGreen} />
                      ) : (
                        <CloseIcon className={classes.textRed} />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    colSpan={5}
                  >
                    No permissions on the menu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

UserDetailMenuAccess.defaultProps = {
  data: null
};

export default UserDetailMenuAccess;
