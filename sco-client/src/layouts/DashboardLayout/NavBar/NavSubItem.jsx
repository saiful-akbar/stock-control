import React from 'react';
import { useNavigate, NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Button,
  ListItem,
  makeStyles
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';


// Style
const useStyles = makeStyles((theme) => ({
  item: {
    display: 'flex',
    padding: 0,
  },
  button: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    justifyContent: 'flex-start',
    letterSpacing: 0,
    padding: '3px 10px 3px 38px',
    textTransform: 'none',
    width: '100%',
    borderRadius: '0 25px 25px 0'
  },
  icon: {
    marginRight: theme.spacing(1),
    fontSize: 22
  },
  title: {
    marginRight: 'auto',
    marginTop: 2
  },
  active: {
    // background: theme.palette.action.selected,
    color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.light,
    '& $title': {
      fontWeight: theme.typography.fontWeightMedium
    },
    '& $icon': {
      color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.light,
    }
  },
}));


// Main component
const NavSubItem = ({
  className,
  href,
  title,
  state,
  ...rest
}) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleLink = (e) => {
    e.preventDefault();
    navigate(href, {
      state: {
        create: state.user_m_s_i_create,
        read: state.user_m_s_i_read,
        update: state.user_m_s_i_update,
        delete: state.user_m_s_i_delete,
      }
    });
  }

  return (
    <ListItem
      className={clsx(classes.item, className)}
      disableGutters
      {...rest}
    >
      <Button
        activeClassName={classes.active}
        className={classes.button}
        component={RouterLink}
        to={href}
        onClick={(e) => handleLink(e)}
      >
        <ArrowRightIcon
          className={classes.icon}
          fontSize="small"
        />
        <span className={classes.title}>
          {title}
        </span>
      </Button>
    </ListItem>
  );
};

// type props menu sub items
NavSubItem.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string
};

export default NavSubItem;
