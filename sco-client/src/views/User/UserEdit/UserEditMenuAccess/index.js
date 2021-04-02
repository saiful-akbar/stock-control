import React from 'react';
import {
  Container,
  Card,
  Switch,
  Divider,
  CardContent,
  Typography,
  Grid,
  Box,
  FormGroup,
  FormControlLabel,
  CircularProgress,
  Button,
  Backdrop
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import { apiUpdateUserMenuAccess } from 'src/services/user';

/**
 * Style
 */
const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor:
      theme.palette.type === 'light'
        ? 'rgba(255,255,255, 0.5)'
        : 'rgba(0,0,0, 0.5)'
  }
}));

/**
 * Komponen utama
 * @param {*} param0
 */
function UserEditMenuAccess({ isSkeletonShow }) {
  const { id } = useParams();
  const classes = useStyles();
  const navigate = useNavigate();

  /**
   * Redux state & dispatch
   */
  const { menuItems, menuSubItems } = useSelector(state => state.menusReducer);
  const { userEdit } = useSelector(state => state.usersReducer);
  const dispatch = useDispatch();

  /**
   * State
   */
  const [selectedMenuItems, setSelectedMenuItems] = React.useState([]);
  const [selectedMenuSubItems, setSelectedMenuSubItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  /**
   * Mengatasi jika komponen dilapas saat request api belum selesai
   */
  const isMounted = React.useRef(true);
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  /**
   * Inisialisasi awal untuk mengisi state selectedMenuItems & selectedMenuSubItems berdasarkan menu akses yang dimiliki user
   */
  React.useEffect(() => {
    let isSelectedMenuItems = [];
    userEdit.menuItems.map(menuItem => {
      return (isSelectedMenuItems = isSelectedMenuItems.concat({
        user_id: id,
        menu_item_id: menuItem.menu_item_id
      }));
    });

    let isSelectedMenuSibItems = [];
    userEdit.menuSubItems.map(menuSubItem => {
      return (isSelectedMenuSibItems = isSelectedMenuSibItems.concat({
        user_id: id,
        menu_sub_item_id: menuSubItem.menu_sub_item_id,
        read: Boolean(menuSubItem.read),
        create: Boolean(menuSubItem.create),
        update: Boolean(menuSubItem.update),
        delete: Boolean(menuSubItem.delete)
      }));
    });

    setSelectedMenuItems(isSelectedMenuItems);
    setSelectedMenuSubItems(isSelectedMenuSibItems);
  }, [userEdit, setSelectedMenuItems, setSelectedMenuSubItems, id]);

  /**
   * FUngsi untuk menghendel saat menu item dipilih
   */
  const handleChangeMenuItem = menuItemId => {
    let selected = [];
    const selectedIndex = selectedMenuItems.findIndex(
      index => index['menu_item_id'] === menuItemId
    );

    if (selectedIndex === -1) {
      selected = selected.concat(selectedMenuItems, {
        user_id: id,
        menu_item_id: menuItemId
      });
    } else if (selectedIndex === 0) {
      selected = selected.concat(selectedMenuItems.slice(1));
    } else if (selectedIndex === selectedMenuItems.length - 1) {
      selected = selected.concat(selectedMenuItems.slice(0, -1));
    } else if (selectedIndex > 0) {
      selected = selected.concat(
        selectedMenuItems.slice(0, selectedIndex),
        selectedMenuItems.slice(selectedIndex + 1)
      );
    }

    setSelectedMenuItems(selected);
  };

  /**
   * Fungsi handle saat menu sub item dipilih
   */
  const handleChangeMenuSubItem = event => {
    const { checked, name } = event.target;
    const selectedType = name.split('_')[0];
    const selectedId = name.split('_')[1];

    let selected = [];
    const selectedIndex = selectedMenuSubItems.findIndex(
      index => index['menu_sub_item_id'] === selectedId
    );

    if (selectedIndex === -1) {
      selected = selected.concat(selectedMenuSubItems, {
        user_id: id,
        menu_sub_item_id: selectedId,
        read: selectedType === 'read' ? checked : false,
        create: selectedType === 'create' ? checked : false,
        update: selectedType === 'update' ? checked : false,
        delete: selectedType === 'delete' ? checked : false
      });
    } else if (selectedIndex >= 0) {
      const updateSelected = selectedMenuSubItems.map(value => {
        if (value.menu_sub_item_id === selectedId) {
          value[selectedType] = checked;
        }
        return value;
      });
      selected = selected.concat(updateSelected);
    }

    setSelectedMenuSubItems(selected);
  };

  const handleSubmit = () => {
    setLoading(true);

    dispatch(
      apiUpdateUserMenuAccess(id, selectedMenuItems, selectedMenuSubItems)
    )
      .then(res => {
        if (isMounted.current) setLoading(false);
      })
      .catch(err => {
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
            break;
        }
      });
  };

  const handleReset = () => {
    let isSelectedMenuItems = [];
    userEdit.menuItems.map(menuItem => {
      return (isSelectedMenuItems = isSelectedMenuItems.concat({
        user_id: id,
        menu_item_id: menuItem.menu_item_id
      }));
    });

    let isSelectedMenuSibItems = [];
    userEdit.menuSubItems.map(menuSubItem => {
      return (isSelectedMenuSibItems = isSelectedMenuSibItems.concat({
        user_id: id,
        menu_sub_item_id: menuSubItem.menu_sub_item_id,
        read: Boolean(menuSubItem.read),
        create: Boolean(menuSubItem.create),
        update: Boolean(menuSubItem.update),
        delete: Boolean(menuSubItem.delete)
      }));
    });

    setSelectedMenuItems(isSelectedMenuItems);
    setSelectedMenuSubItems(isSelectedMenuSibItems);
  };

  return (
    <Container maxWidth="md">
      {isSkeletonShow ? (
        <Box p={2} display="flex" justifyContent="center" alignItems="center">
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Grid container spacing={5} justify="center">
          {menuItems.data.map(menuItem => {
            return (
              <Grid key={menuItem.id} item xs={12}>
                <Card elevation={3}>
                  <Box
                    p={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                  >
                    <FormControlLabel
                      label={menuItem.menu_i_title}
                      control={
                        <Switch
                          color="secondary"
                          onChange={() => handleChangeMenuItem(menuItem.id)}
                          name={menuItem.id}
                          checked={selectedMenuItems.some(
                            data => data.menu_item_id === menuItem.id
                          )}
                        />
                      }
                    />
                  </Box>

                  <Divider />

                  <CardContent>
                    <Grid
                      container
                      spacing={1}
                      direction="row"
                      justify="space-between"
                      alignItems="center"
                    >
                      {menuSubItems.data.map(
                        menuSubItem =>
                          Boolean(menuSubItem.menu_item_id === menuItem.id) && (
                            <React.Fragment key={menuSubItem.id}>
                              <Grid item lg={6} md={5} sm={4} xs={12}>
                                <Box
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  flexDirection="row"
                                  p={1}
                                >
                                  <Typography
                                    variant="body1"
                                    color="textSecondary"
                                    noWrap
                                  >
                                    {menuSubItem.menu_s_i_title}
                                  </Typography>
                                </Box>
                              </Grid>

                              <Grid item lg={6} md={7} sm={8} xs={12}>
                                <FormGroup row>
                                  <FormControlLabel
                                    label="Read"
                                    control={
                                      <Switch
                                        onChange={handleChangeMenuSubItem}
                                        name={`read_${menuSubItem.id}`}
                                        color="primary"
                                        size="small"
                                        disabled={
                                          !Boolean(
                                            selectedMenuItems.find(
                                              data =>
                                                data.menu_item_id ===
                                                menuItem.id
                                            )
                                          )
                                        }
                                        checked={selectedMenuSubItems.some(
                                          data =>
                                            Boolean(
                                              data.menu_sub_item_id ===
                                                menuSubItem.id && data.read
                                            )
                                        )}
                                      />
                                    }
                                  />

                                  <FormControlLabel
                                    label="Create"
                                    control={
                                      <Switch
                                        onChange={handleChangeMenuSubItem}
                                        name={`create_${menuSubItem.id}`}
                                        color="primary"
                                        size="small"
                                        disabled={
                                          !Boolean(
                                            selectedMenuItems.find(
                                              data =>
                                                data.menu_item_id ===
                                                menuItem.id
                                            )
                                          )
                                        }
                                        checked={selectedMenuSubItems.some(
                                          data =>
                                            Boolean(
                                              data.menu_sub_item_id ===
                                                menuSubItem.id && data.create
                                            )
                                        )}
                                      />
                                    }
                                  />

                                  <FormControlLabel
                                    label="Update"
                                    control={
                                      <Switch
                                        onChange={handleChangeMenuSubItem}
                                        name={`update_${menuSubItem.id}`}
                                        color="primary"
                                        size="small"
                                        disabled={
                                          !Boolean(
                                            selectedMenuItems.find(
                                              data =>
                                                data.menu_item_id ===
                                                menuItem.id
                                            )
                                          )
                                        }
                                        checked={selectedMenuSubItems.some(
                                          data =>
                                            Boolean(
                                              data.menu_sub_item_id ===
                                                menuSubItem.id && data.update
                                            )
                                        )}
                                      />
                                    }
                                  />

                                  <FormControlLabel
                                    label="Delete"
                                    control={
                                      <Switch
                                        onChange={handleChangeMenuSubItem}
                                        name={`delete_${menuSubItem.id}`}
                                        color="primary"
                                        size="small"
                                        disabled={
                                          !Boolean(
                                            selectedMenuItems.find(
                                              data =>
                                                data.menu_item_id ===
                                                menuItem.id
                                            )
                                          )
                                        }
                                        checked={selectedMenuSubItems.some(
                                          data =>
                                            Boolean(
                                              data.menu_sub_item_id ===
                                                menuSubItem.id && data.delete
                                            )
                                        )}
                                      />
                                    }
                                  />
                                </FormGroup>
                              </Grid>

                              <Grid item xs={12}>
                                <Divider />
                              </Grid>
                            </React.Fragment>
                          )
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                color="primary"
                size="large"
                disabled={loading}
                onClick={handleReset}
                style={{ marginRight: 10 }}
              >
                {'Reset'}
              </Button>

              <Button
                color="primary"
                variant="contained"
                size="large"
                disabled={loading}
                onClick={handleSubmit}
              >
                {'Save'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}

      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </Container>
  );
}

export default UserEditMenuAccess;
