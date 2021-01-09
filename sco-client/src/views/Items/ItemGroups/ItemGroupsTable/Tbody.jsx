import React from 'react';
import { TableRow, TableCell, Checkbox, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import CustomTooltip from 'src/components/CustomTooltip';
import EditIcon from '@material-ui/icons/Edit';


/**
 * Style
 */
const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: 10,
    paddingTop: 10
  }
}));


/**
 * Komponne utama
 */
function Tbody({
  row,
  columns,
  userAccess,
  onEdit,
  onSelect,
  ...props
}) {
  const classes = useStyles();


  /**
   * Render komponen utama
   */
  return (
    <TableRow {...props}>
      {userAccess !== null && (
        userAccess.user_m_s_i_delete === 1 || userAccess.user_m_s_i_update === 1
          ? (
            <TableCell padding='checkbox'>
              {userAccess.user_m_s_i_delete === 1 && (
                <CustomTooltip placement='bottom' title='Select' >
                  <Checkbox
                    color='primary'
                    checked={props.selected}
                    onClick={(e) => onSelect(e, row.id)}
                  />
                </CustomTooltip>
              )}

              {userAccess.user_m_s_i_update === 1 && (
                <CustomTooltip placement='bottom' title='Edit' >
                  <IconButton onClick={() => onEdit(row)}>
                    <EditIcon fontSize='small' />
                  </IconButton>
                </CustomTooltip>
              )}
            </TableCell>
          ) : null
      )}

      {columns.map((col, key) => (
        <TableCell
          key={key}
          className={classes.root}
          padding={
            userAccess !== null && userAccess.user_m_s_i_delete === 1
              ? 'checkbox'
              : 'default'
          }
        >
          {row[col.field]}
        </TableCell>
      ))}
    </TableRow>
  )
}


/**
 * default props
 */
Tbody.defaultProps = {
  row: {},
  columns: [],
  userAccess: null,
  onEdit: (e) => e.preventDefault(),
  onSelect: (e) => e.preventDefault(),
};


export default Tbody;