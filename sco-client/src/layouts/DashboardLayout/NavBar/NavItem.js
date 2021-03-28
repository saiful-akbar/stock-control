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
import ExpandMore from '@material-ui/icons/ExpandMore';
import { useSelector } from 'react-redux';

// Style untuk komponen NavSubItem
const useStyleNavSubItem = makeStyles(theme => ({
  subMenu: {
    padding: theme.spacing(0.7, 3),
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)'
    }
  },
  subMenuIcon: {
    display: 'inline-flex',
    minWidth: '30px',
    flexShrink: 0,
    marginRight: 5
  },
  icon: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.7)'
  },
  subMenuTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: theme.typography.fontWeightMedium
  },
  subMenuActive: {
    '& $icon': {
      color:
        theme.palette.type === 'dark'
          ? theme.palette.primary.main
          : theme.palette.primary.light
    },
    '& $subMenuTitle': {
      color:
        theme.palette.type === 'dark'
          ? theme.palette.primary.main
          : theme.palette.primary.light
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
  menuActive: {
    background: 'rgba(255, 255, 255, 0.06)',
    paddingBottom: 20
  },
  menu: {
    padding: theme.spacing(1.7, 3),
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      '& $minimizedIcon': {
        display: 'inline-block'
      },
      '& $expandedIcon': {
        display: 'inline-block'
      }
    }
  },
  menuTitle: {
    '& span': {
      color: '#fff',
      fontWeight: theme.typography.fontWeightMedium,
      fontSize: 15
    }
  },
  menuDescTitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,.5)',
    transition: 'opacity .15s cubic-bezier(0.4, 0, 0.2, 1)',
    lineHeight: '16px',
    fontWeight: 400
  },
  expandedIcon: {
    color: '#fff',
    display: 'none',
    transform: 'rotate(180deg)',
    transition: 'opacity .4s, transform .4s'
  },
  minimizedIcon: {
    color: '#fff',
    display: 'none',
    transition: 'opacity .4s, transform .4s'
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)'
  }
}));

// Main component
const NavItem = ({ data }) => {
  const classes = useStyleNavItem();
  const location = useLocation();
  const pathname = location.pathname;
  const { userLogin } = useSelector(state => state.authReducer);

  const [open, setOpen] = React.useState(false);
  const [menuSubItems, setMenuSubItems] = React.useState([]);
  const [MenuSecondaryTitle, SetMenuSecondaryTitle] = React.useState([]);

  React.useEffect(() => {
    if (userLogin.menuSubItems.length > 0) {
      setMenuSubItems(userLogin.menuSubItems); // Simpan data menu sub item

      /*
       * Ambil title dari menu sub item
       * Cek menu item yang aktif saat aplikasi pertama kali di muat
       */
      let titles = [];
      userLogin.menuSubItems.map(msi => {
        if (msi.menu_item_id === data.id && msi.pivot.read === 1) {
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

  /* Render */
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
          <ExpandMore
            className={clsx(classes.minimizedIcon, {
              [classes.expandedIcon]: open
            })}
          />
        </ListItem>

        <Collapse in={open} timeout={0} unmountOnExit>
          <List component="div" disablePadding>
            {menuSubItems.map(
              (msi, key) =>
                Boolean(
                  msi.menu_item_id === data.id && msi.pivot.read === 1
                ) && (
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

      <Divider className={classes.divider} />
    </>
  );
};

NavItem.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object
};

export default NavItem;
