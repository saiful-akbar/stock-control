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
import { Grid, Box, FormControlLabel, Paper } from '@material-ui/core';
import BtnSubmit from 'src/components/BtnSubmit';

/* Style */
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  }
}));

/* Komponen utama */
function UserCreateMenuAccess(props) {
  const classes = useStyles();
  const { dataMenus } = props;

  const [menuItemValues, setMenuItemValues] = React.useState([]);

  const handleChangeMenuItem = id => {
    const selectedIndex = menuItemValues.findIndex(index => index['id'] === id);
    let selected = [];

    if (selectedIndex === -1) {
      selected = selected.concat(menuItemValues, { id: id, read: true });
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

  const isExpanded = id => {
    let value = menuItemValues.filter(value => Boolean(value.id === id));
    return Boolean(value.length > 0);
  };

  return (
    <div className={classes.root}>
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
                                    <Switch edge="end" />
                                  </ListItemSecondaryAction>
                                </ListItem>

                                <ListItem>
                                  <ListItemIcon>
                                    <AddCircleOutlineOutlinedIcon />
                                  </ListItemIcon>
                                  <ListItemText primary="Create" />
                                  <ListItemSecondaryAction>
                                    <Switch edge="end" />
                                  </ListItemSecondaryAction>
                                </ListItem>

                                <ListItem>
                                  <ListItemIcon>
                                    <EditOutlinedIcon />
                                  </ListItemIcon>
                                  <ListItemText primary="Update" />
                                  <ListItemSecondaryAction>
                                    <Switch edge="end" />
                                  </ListItemSecondaryAction>
                                </ListItem>

                                <ListItem>
                                  <ListItemIcon>
                                    <DeleteOutlinedIcon />
                                  </ListItemIcon>
                                  <ListItemText primary="Delete" />
                                  <ListItemSecondaryAction>
                                    <Switch edge="end" />
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
          <Box display="flex" justifyContent="flex-end">
            <BtnSubmit title="Save" variant="contained" size="large" />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default connect(null, null)(UserCreateMenuAccess);
