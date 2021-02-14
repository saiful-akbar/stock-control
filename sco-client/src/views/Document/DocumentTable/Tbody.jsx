import React from 'react';
import { TableRow, TableCell, Checkbox, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import CustomTooltip from 'src/components/CustomTooltip';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';

/* Style */
const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: 10,
    paddingTop: 10
  }
}));

/* Komponne utama */
function Tbody({ row, columns, userAccess, onEdit, onSelect, ...props }) {
  const classes = useStyles();

  /* Render komponen utama */
  return (
    <TableRow {...props}>
      {/* Cell checkbox */}
      {Boolean(userAccess !== null && userAccess.user_m_i_delete === 1) && (
        <TableCell padding="checkbox">
          <CustomTooltip placement="bottom" title="Select">
            <Checkbox
              color="primary"
              checked={props.selected}
              onClick={e => onSelect(e, row.id)}
            />
          </CustomTooltip>
        </TableCell>
      )}

      {/* Cell data document */}
      {columns.map((col, key) => (
        <TableCell
          key={key}
          className={classes.root}
          padding={
            Boolean(userAccess !== null && userAccess.user_m_i_delete === 1)
              ? 'checkbox'
              : 'default'
          }
        >
          {row[col.field]}
        </TableCell>
      ))}

      {/* Cell actions edit & delete */}
      {Boolean(userAccess !== null) && (
        <TableCell padding="checkbox">
          {userAccess.user_m_i_update === 1 && (
            <CustomTooltip placement="bottom" title="Edit">
              <IconButton onClick={() => onEdit(row)}>
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </CustomTooltip>
          )}

          {userAccess.user_m_i_delete === 1 && (
            <CustomTooltip placement="bottom" title="Delete">
              <IconButton onClick={() => onEdit(row)}>
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </CustomTooltip>
          )}
        </TableCell>
      )}
    </TableRow>
  );
}

/* default props */
Tbody.defaultProps = {
  row: {},
  columns: [],
  userAccess: null,
  onEdit: e => e.preventDefault(),
  onSelect: e => e.preventDefault()
};

export default Tbody;
