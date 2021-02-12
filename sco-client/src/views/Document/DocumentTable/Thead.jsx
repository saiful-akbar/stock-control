import React from 'react';
import { TableCell, TableSortLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

/* Style */
const useStyles = makeStyles(theme => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  }
}));

/* Komponen utama */
function Thead({ column, selected, data, onSort, ...props }) {
  const classes = useStyles();

  /* Render komponen */
  return (
    <TableCell align={column.align} className={classes.tableCell} {...props}>
      <TableSortLabel
        active={Boolean(data.sort === column.field)}
        onClick={() => onSort(column.field)}
        direction={data.sort === column.field ? data.order_by : 'asc'}
      >
        {column.label}
        {data.sort === column.field && (
          <span className={classes.visuallyHidden}>
            {data.order_by === 'desc'
              ? 'sorted descending'
              : 'sorted ascending'}
          </span>
        )}
      </TableSortLabel>
    </TableCell>
  );
}

/* default props */
Thead.defaultProps = {
  column: {
    field: '',
    label: '',
    align: 'left'
  },
  selected: [],
  data: [],
  onSort: () => null
};

export default Thead;
