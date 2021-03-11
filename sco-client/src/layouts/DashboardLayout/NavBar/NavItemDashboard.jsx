import React from 'react';
import { NavLink } from 'react-router-dom';
import { ListItem, makeStyles, Typography, Divider } from '@material-ui/core';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';

// Style untuk komponen NavItem
const useStyle = makeStyles(theme => ({
  root: {
    paddingTop: 17,
    paddingBottom: 17
  },
  subMenuIcon: {
    display: 'inline-flex',
    minWidth: '30px',
    flexShrink: 0,
    marginRight: 5
  },
  icon: {
    fontSize: 20,
    color: theme.palette.text.secondary
  },
  subMenuTitle: {
    fontSize: 14,
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium
  },
  subMenuActive: {
    '& $icon': {
      color: theme.palette.primary.main
    },
    '& $subMenuTitle': {
      color: theme.palette.primary.main
    }
  }
}));

// Main component
const NavItemDashboard = () => {
  const classes = useStyle();

  /* Render */
  return (
    <div>
      <ListItem
        button
        className={classes.root}
        activeClassName={classes.subMenuActive}
        component={NavLink}
        to="dashboard"
      >
        <div className={classes.subMenuIcon}>
          <DashboardOutlinedIcon className={classes.icon} />
        </div>

        <Typography noWrap variant="subtitle2" className={classes.subMenuTitle}>
          Dashboard
        </Typography>
      </ListItem>

      <Divider />
    </div>
  );
};

export default NavItemDashboard;
