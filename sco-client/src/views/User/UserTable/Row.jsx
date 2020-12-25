import React from "react";
import PropTypes from "prop-types";
import {
  makeStyles,
  withStyles
} from "@material-ui/core/styles";
import {
  Box,
  TableCell,
  TableRow,
  Typography,
  Avatar,
  Icon,
  Badge,
} from "@material-ui/core";
import apiUrl from "src/apiUrl";
import UserTableOptions from "../UserTableOptions";


/**
 * Custom style avatar badge 
 */
const StyledBadge = withStyles((theme) => ({
  badge: {
    color: theme.palette.type === 'light' ? '#263238' : '#FFFFFF',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: "''",
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);


/**
 * Style untuk komponent Row
 */
const useRowStyles = makeStyles((theme) => ({
  avatar: {
    width: 42,
    height: 42,
  },
  red: {
    color: theme.palette.error.light,
  },
  green: {
    color: theme.palette.success.light,
  },
}));


function Row(props) {
  const { row, onDelete, state, onChangePassword } = props;
  const classes = useRowStyles();


  return (
    <React.Fragment>
      <TableRow hover className={classes.root}>
        <TableCell>
          <UserTableOptions
            userData={row}
            state={state}
            onDelete={() => onDelete(row.id)}
            onChangePassword={() => onChangePassword(row.id)}

          />
        </TableCell>

        <TableCell>
          <Box
            display="flex"
            alignItems="center"
          >
            <StyledBadge
              overlap="circle"
              variant="dot"
              color={Boolean(row.token) ? "primary" : "error"}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <Avatar
                className={classes.avatar}
                alt={row.profile_name}
                src={Boolean(row.profile_avatar) ? apiUrl(`/avatar/${row.profile_avatar}`) : ""}
              />
            </StyledBadge>

            <div style={{ marginLeft: 10 }}>
              <Typography
                color="textPrimary"
                variant="body2"
                noWrap
              >
                {row.profile_name}
              </Typography>

              <Typography
                color="textSecondary"
                variant="caption"
                noWrap
              >
                {
                  row.profile_division === null || row.profile_division === ""
                    ? "..."
                    : row.profile_division
                }
              </Typography>
            </div>
          </Box>
        </TableCell>

        <TableCell>{row.username}</TableCell>

        <TableCell>
          <Icon className={row.is_active === 1 ? classes.green : classes.red} >
            {row.is_active === 1 ? "check" : "close"}
          </Icon>
        </TableCell>

        <TableCell>{row.profile_email === null || row.profile_email === "" ? "..." : row.profile_email}</TableCell>
        <TableCell>{row.profile_phone === null || row.profile_phone === "" ? "..." : row.profile_phone}</TableCell>
        <TableCell>{row.profile_address === null || row.profile_address === "" ? "..." : row.profile_address}</TableCell>
        <TableCell>{row.created_at}</TableCell>
        <TableCell>{row.updated_at}</TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired,
};

export default Row;