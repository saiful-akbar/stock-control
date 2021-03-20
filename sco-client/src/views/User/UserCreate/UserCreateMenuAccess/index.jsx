import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import {
  Grid,
  Box,
  FormControlLabel,
  Paper,
  Button,
  CircularProgress,
  Backdrop
} from '@material-ui/core';
import { apiCreateUserMenuAccess } from 'src/services/user';
import { useNavigate } from 'react-router';

/* Style */
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor:
      theme.palette.type === 'light'
        ? 'rgba(255,255,255, 0.5)'
        : 'rgba(0,0,0, 0.5)'
  }
}));

/* Komponen utama */
function UserCreateMenuAccess(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const isMounted = React.useRef(true);
  const { dataMenus } = props;

  const [menuItemValues, setMenuItemValues] = React.useState([]);
  const [menuSubItemValues, setMenuSubItemValues] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  /* Merubah maunted menjadi false ketika komponen dilepas */
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
    // eslint-disble-next-line
  }, []);

  /* FUngsi untuk menghendel saat menu item dipilih */
  const handleChangeMenuItem = id => {
    let selected = [];
    const selectedIndex = menuItemValues.findIndex(
      index => index['menu_item_id'] === id
    );

    if (selectedIndex === -1) {
      selected = selected.concat(menuItemValues, {
        user_id: props.userId,
        menu_item_id: id,
        read: true
      });
    } else if (selectedIndex === 0) {
      selected = selected.concat(menuItemValues.slice(1));
    } else if (selectedIndex === menuItemValues.length - 1) {
      selected = selected.concat(menuItemValues.slice(0, -1));
    } else if (selectedIndex > 0) {
      selected = selected.concat(
        menuItemValues.slice(0, selectedIndex),
        menuItemValues.slice(selectedIndex + 1)
      );
    }
    setMenuItemValues(selected);
  };

  /* FUngsi untuk menutup atau membuka acordion menu item */
  const isExpanded = id => {
    let value = menuItemValues.filter(value =>
      Boolean(value.menu_item_id === id)
    );
    return Boolean(value.length > 0);
  };

  /* Fungsi handle saat menu sub item dipilih */
  const handleChangeMenuSubItem = event => {
    const { checked, name } = event.target;
    const type = name.split('_')[0];
    const id = name.split('_')[1];

    let selected = [];
    const selectedIndex = menuSubItemValues.findIndex(
      i => i['menu_sub_item_id'] === id
    );

    if (selectedIndex === -1) {
      selected = selected.concat(menuSubItemValues, {
        user_id: props.userId,
        menu_sub_item_id: id,
        read: type === 'read' ? checked : false,
        create: type === 'create' ? checked : false,
        update: type === 'update' ? checked : false,
        delete: type === 'delete' ? checked : false
      });
    } else {
      const updateSelected = menuSubItemValues.map(value => {
        if (value.menu_sub_item_id === id) {
          value[type] = checked;
        }
        return value;
      });
      selected = selected.concat(updateSelected);
    }

    setMenuSubItemValues(selected);
  };

  /* Fungsi utuk submit */
  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    apiCreateUserMenuAccess(menuItemValues, menuSubItemValues)
      .then(res => {
        if (isMounted.current) {
          props.setReduxToast(true, 'success', res.data.message);
          setLoading(false);
          navigate('/users');
        }
      })
      .catch(err => {
        if (isMounted.current) {
          switch (err.status) {
            case 401:
              window.location.href = '/logout';
              break;

            case 403:
              navigate('/error/forbidden');
              break;

            case 404:
              navigate('/error/notfound');
              break;

            default:
              setLoading(false);
              props.setReduxToast(
                true,
                'err',
                `(${err.status}) ${err.data.message}`
              );
              break;
          }
        }
      });
  };

  return (
    <div className={classes.root}>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography noWrap variant="h5" color="textPrimary">
              Menu Access
            </Typography>

            <Typography noWrap variant="subtitle1" color="textSecondary">
              Select menu access for the user
            </Typography>
          </Grid>

          <Grid item xs={12}>
            {Boolean(dataMenus !== null) &&
              dataMenus.menu_items.map(menuItem => (
                <Accordion
                  key={menuItem.id}
                  expanded={isExpanded(menuItem.id)}
                  onChange={() => handleChangeMenuItem(menuItem.id)}
                  elevation={3}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <FormControlLabel
                      control={<Switch />}
                      checked={isExpanded(menuItem.id)}
                      label={menuItem.menu_i_title}
                    />
                  </AccordionSummary>

                  <AccordionDetails>
                    <Grid container spacing={3}>
                      {dataMenus.menu_sub_items.map(
                        (menuSubItem, key) =>
                          menuSubItem.menu_item_id === menuItem.id && (
                            <Grid item md={4} sm={6} xs={12} key={key}>
                              <Paper variant="outlined">
                                <List
                                  subheader={
                                    <ListSubheader>
                                      {menuSubItem.menu_s_i_title}
                                    </ListSubheader>
                                  }
                                >
                                  <ListItem>
                                    <ListItemIcon>
                                      <VisibilityOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Read" />
                                    <ListItemSecondaryAction>
                                      <Switch
                                        edge="end"
                                        name={`read_${menuSubItem.id}`}
                                        onChange={handleChangeMenuSubItem}
                                      />
                                    </ListItemSecondaryAction>
                                  </ListItem>

                                  <ListItem>
                                    <ListItemIcon>
                                      <AddCircleOutlineOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Create" />
                                    <ListItemSecondaryAction>
                                      <Switch
                                        edge="end"
                                        name={`create_${menuSubItem.id}`}
                                        onChange={handleChangeMenuSubItem}
                                      />
                                    </ListItemSecondaryAction>
                                  </ListItem>

                                  <ListItem>
                                    <ListItemIcon>
                                      <EditOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Update" />
                                    <ListItemSecondaryAction>
                                      <Switch
                                        edge="end"
                                        name={`update_${menuSubItem.id}`}
                                        onChange={handleChangeMenuSubItem}
                                      />
                                    </ListItemSecondaryAction>
                                  </ListItem>

                                  <ListItem>
                                    <ListItemIcon>
                                      <DeleteOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Delete" />
                                    <ListItemSecondaryAction>
                                      <Switch
                                        edge="end"
                                        name={`delete_${menuSubItem.id}`}
                                        onChange={handleChangeMenuSubItem}
                                      />
                                    </ListItemSecondaryAction>
                                  </ListItem>
                                </List>
                              </Paper>
                            </Grid>
                          )
                      )}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSubmit}
                disabled={Boolean(
                  menuItemValues.length === 0 ||
                    menuSubItemValues.length === 0 ||
                    loading
                )}
              >
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    setReduxToast: (show, type, message) =>
      dispatch({
        type: 'SET_TOAST',
        value: {
          show: show,
          type: type,
          message: message
        }
      })
  };
}

export default connect(null, mapDispatchToProps)(UserCreateMenuAccess);
