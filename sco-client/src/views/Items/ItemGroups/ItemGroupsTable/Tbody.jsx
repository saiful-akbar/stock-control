import React from 'react';
import { TableRow, TableCell, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import CustomTooltip from 'src/components/CustomTooltip';


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
  onUpdate,
  onSelect,
  ...props
}) {
  const classes = useStyles();


  /**
   * Render komponen utama
   */
  return (
    <TableRow {...props}>
      {userAccess !== null && userAccess.user_m_s_i_delete === 1 && (
        <TableCell padding='checkbox'>
          <CustomTooltip placement='bottom' title='Select' >
            <Checkbox
              color='primary'
              checked={props.selected}
              onClick={(e) => onSelect(e, row.id)}
            />
          </CustomTooltip>
        </TableCell>

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
  onUpdate: (e) => e.preventDefault(),
  onSelect: (e) => e.preventDefault(),
};


export default Tbody;