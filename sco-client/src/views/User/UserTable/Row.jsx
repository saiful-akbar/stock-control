import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Box,
  TableCell,
  TableRow,
  Typography,
  Avatar,
  Icon,
  Badge,
  Link,
  ButtonBase
} from '@material-ui/core';
import apiUrl from 'src/utils/apiUrl';
import UserTableOptions from '../UserTableOptions';
import { useNavigate } from 'react-router-dom';

/**
 * Custom style avatar badge
 */
const StyledBadge = withStyles(theme => ({
  badge: {
    color: theme.palette.type === 'light' ? '#263238' : '#FFFFFF',
    boxShadow: `0 0 0 2px ${theme.palette.primary.paper}`,
    '&::after': {
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: "''"
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
}))(Badge);

/**
 * Style untuk komponent Row
 */
const useRowStyles = makeStyles(theme => ({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: '50%'
  },
  red: {
    color: theme.palette.error.light
  },
  green: {
    color: theme.palette.success.light
  },
  link: {
    color: 'inherit',
    fontWeight: 'bold',
    '&:hover': {
      color: theme.palette.info.main
    }
  },
  tableCell: {
    padding: 10
  }
}));

function Row(props) {
  const { row, onDelete, onClearLogs, state, onChangePassword } = props;
  const classes = useRowStyles();
  const navigate = useNavigate();

  /**
   * FUngsi link ke halaman user view detail
   * @param {obj} e
   */
  const goto = e => {
    e.preventDefault();
    navigate(`/users/${row.id}`);
  };

  return (
    <React.Fragment>
      <TableRow hover className={classes.root}>
        <TableCell className={classes.tableCell}>
          <UserTableOptions
            userData={row}
            state={state}
            onDelete={() => onDelete()}
            onClearLogs={() => onClearLogs()}
            onChangePassword={() => onChangePassword()}
          />
        </TableCell>

        <TableCell className={classes.tableCell}>
          <Box display="flex" alignItems="center">
            <StyledBadge
              overlap="circle"
              variant="dot"
              color={Boolean(row.token) ? 'secondary' : 'error'}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <ButtonBase onClick={goto} className={classes.avatar}>
                <Avatar
                  className={classes.avatar}
                  alt={row.profile_name}
                  src={
                    row.profile_avatar !== null
                      ? apiUrl(`/avatar/${row.profile_avatar}`)
                      : null
                  }
                />
              </ButtonBase>
            </StyledBadge>

            <div style={{ marginLeft: 10 }}>
              <Typography>
                <Link
                  className={classes.link}
                  variant="body2"
                  href={`/users/${row.id}`}
                  onClick={goto}
                >
                  {row.profile_name}
                </Link>
              </Typography>

              <Typography color="textSecondary" variant="caption">
                {row.profile_division === null || row.profile_division === ''
                  ? '...'
                  : row.profile_division}
              </Typography>
            </div>
          </Box>
        </TableCell>

        <TableCell className={classes.tableCell}>{row.username}</TableCell>

        <TableCell className={classes.tableCell}>
          <Icon className={row.is_active === 1 ? classes.green : classes.red}>
            {row.is_active === 1 ? 'check' : 'close'}
          </Icon>
        </TableCell>

        <TableCell className={classes.tableCell}>{row.created_at}</TableCell>
        <TableCell className={classes.tableCell}>{row.updated_at}</TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.object.isRequired
};

export default Row;
