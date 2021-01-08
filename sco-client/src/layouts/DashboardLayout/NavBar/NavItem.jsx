import React from 'react';
import {
  NavLink as RouterLink,
  useLocation,
  useNavigate
} from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Button,
  ListItem,
  makeStyles,
  Collapse,
  Typography,
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import NavSubItem from './NavSubItem';
import Icon from '@material-ui/core/Icon';
import { connect } from 'react-redux';
import CustomTooltip from 'src/components/CustomTooltip';


// Style
const useStyles = makeStyles((theme) => ({
  item: {
    display: 'flex',
    padding: 0,
    margin: '5px 0',
  },
  button: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    justifyContent: 'flex-start',
    letterSpacing: 0,
    padding: '5px 10px',
    textTransform: 'none',
    width: '100%',
    borderRadius: '0 25px 25px 0'
  },
  icon: {
    marginRight: theme.spacing(2),
    fontSize: 20
  },
  title: {
    marginRight: 'auto',
    marginTop: 2,
    fontWeight: 500,
  },
  active: {
    background: theme.palette.action.selected,
    color: theme.palette.primary.main,
    '& $title': {
      fontWeight: theme.typography.fontWeightMedium
    },
    '& $icon': {
      color: theme.palette.primary.main
    }
  },
}));


// Main component
const NavItem = ({
  className,
  data,
  collapse,
  collapseActive,
  reduxUserLogin,
}) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const location = useLocation();
  const pathname = location.pathname.split('/');

  const [open, setOpen] = React.useState(false);

  /**
   * Handle collapse menu
   */
  const handleCollapse = () => {
    open ? collapseActive(null) : collapseActive(data.menu_i_url);
  };

  React.useEffect(() => {
    data.menu_i_url === collapse ? setOpen(true) : setOpen(false);
  }, [data.menu_i_url, collapse]);

  const handleLink = (e) => {
    e.preventDefault();
    collapseActive(null);
    navigate(data.menu_i_url, {
      state: {
        create: data.pivot.user_m_i_create,
        read: data.pivot.user_m_i_read,
        update: data.pivot.user_m_i_update,
        delete: data.pivot.user_m_i_delete,
      }
    });
  }

  const listDefault = () => {
    return (
      <ListItem
        className={clsx(classes.item, className)}
        disableGutters
      >
        <CustomTooltip title={data.menu_i_title} placement='right'>
          <Button
            activeClassName={classes.active}
            className={classes.button}
            component={RouterLink}
            to={data.menu_i_url}
            onClick={(e) => handleLink(e)}
          >
            {data.menu_i_icon && (
              <Icon className={classes.icon} >
                {data.menu_i_icon}
              </Icon>
            )}

            <Typography
              noWrap
              variant="body2"
              component="span"
              className={classes.title}
            >
              {data.menu_i_title}
            </Typography>
          </Button>
        </CustomTooltip>
      </ListItem >
    );
  };

  const listCollapse = () => {
    return (
      <>
        <ListItem
          className={clsx(classes.item, className)}
          disableGutters
          onClick={handleCollapse}
        >
          <CustomTooltip title={data.menu_i_title} placement='right'>
            <Button
              className={classes.button}
              component={RouterLink}
              to={{ hash: `#${data.menu_i_url}` }}
              onClick={(e) => e.preventDefault()}
              activeClassName={
                data.menu_i_url === `/${pathname[1]}`
                  ? classes.active
                  : ''
              }
            >
              {data.menu_i_icon && (
                <Icon className={classes.icon} >
                  {data.menu_i_icon}
                </Icon>
              )}

              <Typography
                noWrap
                variant="body2"
                component="span"
                className={classes.title}
              >
                {data.menu_i_title}
              </Typography>

              {open ? <ExpandLess /> : <ExpandMore />}
            </Button>
          </CustomTooltip>
        </ListItem>

        <Collapse in={open} timeout='auto' unmountOnExit>
          {reduxUserLogin.menu_sub_items.map((sub, key) => {
            if (data.id === sub.menu_item_id) {
              return (
                <NavSubItem
                  key={key}
                  href={sub.menu_s_i_url}
                  title={sub.menu_s_i_title}
                  state={sub.pivot}
                />
              )
            }
            return null;
          })}
        </Collapse>
      </>
    );
  };

  return data.menu_i_children === 1 ? listCollapse() : listDefault();
};

NavItem.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string
};

const reduxState = (state) => ({
  reduxUserLogin: state.userLogin,
});

export default connect(reduxState, null)(NavItem);
