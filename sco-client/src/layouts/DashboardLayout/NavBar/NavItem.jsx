import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  ListItem,
  makeStyles,
  Collapse,
  Typography,
  ListItemText,
  Icon,
  List,
  Divider
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { connect } from 'react-redux';

// Style untuk komponen NavSubItem
const useStyleNavSubItem = makeStyles(theme => ({
  subMenu: {
    paddingTop: 5,
    paddingBottom: 5
  },
  subMenuIcon: {
    display: 'inline-flex',
    minWidth: '30px',
    flexShrink: 0
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

/* Komponent NavSubItem */
function NavSubItem({ url, icon, title, handleActiveParent, ...rest }) {
  const classes = useStyleNavSubItem();

  return (
    <ListItem
      button
      className={classes.subMenu}
      activeClassName={classes.subMenuActive}
      component={NavLink}
      to={url}
      {...rest}
    >
      <div className={classes.subMenuIcon}>
        <Icon className={classes.icon}>{icon}</Icon>
      </div>

      <Typography noWrap variant="subtitle2" className={classes.subMenuTitle}>
        {title}
      </Typography>
    </ListItem>
  );
}

// Style untuk komponen NavItem
const useStyleNavItem = makeStyles(theme => ({
  menu: {
    paddingTop: 10,
    paddingBottom: 10,
    minHeight: 58
  },
  menuTitle: {
    '& span': {
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightMedium,
      fontSize: 15
    }
  },
  menuDescTitle: {
    fontSize: 12,
    color: theme.palette.text.secondary
  },
  menuActive: {
    background:
      theme.palette.type === 'dark'
        ? 'rgba(255, 255, 255, 0.02)'
        : 'rgba(0, 0, 0, 0.03)',
    paddingBottom: 20
  }
}));

// Main component
const NavItem = ({ data, reduxUserLogin }) => {
  const classes = useStyleNavItem();
  const location = useLocation();
  const pathname = location.pathname;

  const [open, setOpen] = React.useState(false);
  const [menuSubItems, setMenuSubItems] = React.useState([]);
  const [MenuSecondaryTitle, SetMenuSecondaryTitle] = React.useState([]);

  React.useEffect(() => {
    if (reduxUserLogin !== null) {
      /* Simpan data menu sub item */
      setMenuSubItems(reduxUserLogin.menu_sub_items);

      /*
       * Ambil title dari menu sub item
       * Cek menu item yang aktif saat aplikasi pertama kali di muat
       */
      let titles = [];
      reduxUserLogin.menu_sub_items.map(msi => {
        if (msi.menu_item_id === data.id) {
          if (msi.menu_s_i_url === pathname.slice(0, msi.menu_s_i_url.length)) {
            setOpen(true);
          }
          return titles.push(msi.menu_s_i_title);
        }
        return null;
      });
      SetMenuSecondaryTitle(titles);
    }

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className={clsx({ [classes.menuActive]: open })}>
        <ListItem
          button
          onClick={() => setOpen(!open)}
          className={classes.menu}
        >
          <ListItemText
            className={classes.menuTitle}
            primary={data.menu_i_title}
            secondary={
              open ? null : (
                <Typography
                  noWrap
                  variant="subtitle2"
                  className={classes.menuDescTitle}
                >
                  {MenuSecondaryTitle.join(', ')}
                </Typography>
              )
            }
          />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={open} timeout={1} unmountOnExit>
          <List component="div" disablePadding>
            {menuSubItems.map(
              (msi, key) =>
                Boolean(msi.menu_item_id === data.id) && (
                  <NavSubItem
                    url={msi.menu_s_i_url}
                    icon={msi.menu_s_i_icon}
                    title={msi.menu_s_i_title}
                    key={key}
                    handleActiveParent={value => {
                      console.log(msi.menu_s_i_title + ' => ', value);
                      if (value) {
                        setOpen(true);
                      }
                    }}
                  />
                )
            )}
          </List>
        </Collapse>
      </div>
      <Divider />
    </>
  );
};

NavItem.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object
};

const reduxState = state => ({
  reduxUserLogin: state.userLogin
});

export default connect(reduxState, null)(NavItem);
