import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  Chip,
  FormControl,
  FormHelperText,
  Badge,
  Avatar,
  Box,
  ButtonBase,
  InputLabel,
  Select,
  MenuItem,
  ListSubheader
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { makeStyles, withStyles } from '@material-ui/styles';

/* Style */
const useStyles = makeStyles(theme => ({
  avatar: {
    cursor: 'pointer',
    borderRadius: '50%',
    width: theme.spacing(35),
    height: theme.spacing(35),
    [theme.breakpoints.down('xs')]: {
      width: theme.spacing(20),
      height: theme.spacing(20)
    }
  },
  inputAvatar: {
    display: 'none'
  }
}));

/* Small chip untuk avatar */
const SmallChip = withStyles(theme => ({
  root: {
    border: `2px solid ${theme.palette.background.paper}`,
    cursor: 'pointer'
  }
}))(Chip);

/* Component view avatar */
function ViewAvatar({ file = '', ...props }) {
  const [thumb, setThumb] = React.useState('');

  React.useEffect(() => {
    if (typeof file === 'object') {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = e => setThumb(e.target.result);
    } else {
      setThumb(file);
    }
  }, [file, setThumb]);

  return (
    <Badge
      overlap="circle"
      badgeContent={<SmallChip label="Upload" />}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
    >
      <Avatar alt="Avatar" src={thumb} {...props} />
    </Badge>
  );
}

/* Komponen utama */
function FormCreateProfile({
  loading,
  dataMenus,
  values,
  handleBlur,
  handleChange,
  setFieldValue,
  touched,
  errors,
  ...props
}) {
  const classes = useStyles();

  return (
    <Card variant="outlined">
      <CardHeader
        title="Profile Form"
        subheader="This data is used for user profile information"
      />

      <CardContent>
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <Box display="flex" justifyContent="center" alignItems="center">
              {dataMenus === null ? (
                <Skeleton variant="circle" className={classes.avatar} />
              ) : (
                <FormControl error={Boolean(touched.avatar && errors.avatar)}>
                  <input
                    type="file"
                    accept="image/*"
                    name="avatar"
                    id="avatar"
                    className={classes.inputAvatar}
                    disabled={loading}
                    onChange={event => {
                      setFieldValue('avatar', event.target.files[0]);
                    }}
                  />

                  <label htmlFor="avatar">
                    <ButtonBase className={classes.avatar} component="div">
                      <ViewAvatar
                        id="avatar"
                        file={values.avatar}
                        className={classes.avatar}
                      />
                    </ButtonBase>
                  </label>

                  <FormHelperText style={{ textAlign: 'center' }}>
                    {touched.avatar && errors.avatar}
                  </FormHelperText>
                </FormControl>
              )}
            </Box>
          </Grid>

          <Grid item md={6} xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {dataMenus === null ? (
                  <Skeleton variant="rect" height={54} />
                ) : (
                  <TextField
                    fullWidth
                    required
                    label="Name"
                    name="name"
                    type="text"
                    variant="outlined"
                    disabled={loading}
                    value={values.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                )}
              </Grid>

              <Grid item xs={12}>
                {dataMenus === null ? (
                  <Skeleton variant="rect" height={54} />
                ) : (
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    variant="outlined"
                    disabled={loading}
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                )}
              </Grid>

              <Grid item xs={12}>
                {dataMenus === null ? (
                  <Skeleton variant="rect" height={54} />
                ) : (
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    type="number"
                    variant="outlined"
                    max={13}
                    disabled={loading}
                    value={values.phone}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                )}
              </Grid>

              <Grid item xs={12}>
                {dataMenus === null ? (
                  <Skeleton variant="rect" height={54} />
                ) : (
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={Boolean(touched.division && errors.division)}
                  >
                    <InputLabel htmlFor="divivsion">Division</InputLabel>

                    <Select
                      id="divivsion"
                      label="Division"
                      name="division"
                      disabled={loading}
                      value={values.division}
                      onChange={handleChange}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <ListSubheader>Warehouse</ListSubheader>
                      <MenuItem value="Stock Control">
                        Stock Control (SCO)
                      </MenuItem>
                      <MenuItem value="Audit Stock">Audit Stock</MenuItem>
                      <MenuItem value="Admin Warehouse">
                        Admin Warehouse
                      </MenuItem>
                      <MenuItem value="Operational Warehouse">
                        Operational Warehouse
                      </MenuItem>
                    </Select>

                    <FormHelperText>
                      {touched.division && errors.division}
                    </FormHelperText>
                  </FormControl>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            {dataMenus === null ? (
              <Skeleton variant="rect" height={111} />
            ) : (
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Address"
                name="address"
                type="text"
                variant="outlined"
                disabled={loading}
                value={values.address}
                onBlur={handleBlur}
                onChange={handleChange}
                error={Boolean(touched.address && errors.address)}
                helperText={touched.address && errors.address}
              />
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default FormCreateProfile;
