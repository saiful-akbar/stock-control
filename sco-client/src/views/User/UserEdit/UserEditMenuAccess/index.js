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
  Icon
} from '@material-ui/core';
import { useSelector } from 'react-redux';

function UserEditMenuAccess({ isSkeletonShow }) {
  const [isChecked, setChecked] = React.useState(false);
  const { menuItems, menuSubItems } = useSelector(state => state.menusReducer);

  return (
    <Container maxWidth="md">
      {isSkeletonShow ? (
        <Box p={2} display="flex" justifyContent="center" alignItems="center">
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Grid container spacing={5} justify="center">
          {menuItems.data.map(menuItem => (
            <Grid key={menuItem.id} item xs={12}>
              <Card elevation={3}>
                <Box
                  p={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Switch
                    checked={isChecked}
                    onChange={() => setChecked(!isChecked)}
                    color="secondary"
                    name={menuItem.id}
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />

                  <Typography variant="h6" color="textPrimary" noWrap>
                    {menuItem.menu_i_title}
                  </Typography>
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
                              <Icon>{menuSubItem.menu_s_i_icon}</Icon>
                              <Typography
                                variant="body1"
                                color="textSecondary"
                                noWrap
                              >
                                {menuSubItem.menu_s_i_title}
                              </Typography>
                            </Grid>

                            <Grid item lg={6} md={7} sm={8} xs={12}>
                              <FormGroup row>
                                <FormControlLabel
                                  label="Read"
                                  control={
                                    <Switch
                                      checked={isChecked}
                                      onChange={() => setChecked(!isChecked)}
                                      name="read"
                                    />
                                  }
                                />

                                <FormControlLabel
                                  label="Create"
                                  control={
                                    <Switch
                                      checked={isChecked}
                                      onChange={() => setChecked(!isChecked)}
                                      name="create"
                                    />
                                  }
                                />

                                <FormControlLabel
                                  label="Update"
                                  control={
                                    <Switch
                                      checked={isChecked}
                                      onChange={() => setChecked(!isChecked)}
                                      name="update"
                                    />
                                  }
                                />

                                <FormControlLabel
                                  label="Delete"
                                  control={
                                    <Switch
                                      checked={isChecked}
                                      onChange={() => setChecked(!isChecked)}
                                      name="delete"
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
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default UserEditMenuAccess;
