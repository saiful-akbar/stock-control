import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { useSelector } from 'react-redux';
import permissionImage from 'src/assets/images/svg/permission.svg';

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
  },
  content: {
    padding: theme.spacing(5)
  },
  image: {
    backgroundImage: `url(${permissionImage})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto 100%',
    height: 150,
    [theme.breakpoints.down('sm')]: {
      height: 100
    }
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
function UserDetailMenuAccess({ isSkeletonShow }) {
  const classes = useStyles();

  /**
   * Redux
   */
  const { menuSubItems } = useSelector(state => state.usersReducer.userDetail);

  return (
    <Card elevation={3}>
      <CardContent className={classes.content}>
        <Grid
          container
          spacing={5}
          direction="row"
          justify="space-between"
          alignItems="flex-start"
        >
          <Grid item md={6} xs={8}>
            <Typography variant="h5" color="textPrimary" noWrap>
              {'Menu access permissions'}
            </Typography>

            <Typography variant="subtitle2" color="textSecondary">
              {
                'The table below lists the user permissions for the available menus'
              }
            </Typography>
          </Grid>

          <Grid item md={6} xs={4} className={classes.image} />

          <Grid item xs={12}>
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
                  {isSkeletonShow ? (
                    <TableRow>
                      <TableCell
                        className={classes.tableCell}
                        align="center"
                        colSpan={5}
                      >
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : menuSubItems.length > 0 ? (
                    menuSubItems.map(subMenu => (
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
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

UserDetailMenuAccess.defaultProps = {
  isSkeletonShow: false
};

export default UserDetailMenuAccess;
