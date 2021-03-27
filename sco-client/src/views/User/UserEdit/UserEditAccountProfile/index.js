import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Switch,
  Container,
  Box
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import accountImage from 'src/assets/images/svg/account.svg';
import CustomTooltip from 'src/components/CustomTooltip';

/**
 * Style
 */
const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(5)
  },
  image: {
    backgroundImage: `url(${accountImage})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto 100%',
    height: 150,
    [theme.breakpoints.down('sm')]: {
      height: 100
    }
  }
}));

/**
 * Komponen utama
 * @param {*} param0
 */
const UserEditAccountProfile = ({ isSkeletonShow }) => {
  const classes = useStyles();

  /**
   * State
   */
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Container maxWidth="md">
      <Card elevation={3}>
        <CardContent className={classes.content}>
          <Grid
            container
            spacing={3}
            direction="row"
            justify="space-between"
            alignItems="flex-start"
          >
            <Grid item md={6} xs={8}>
              <Typography variant="h5" color="textPrimary" noWrap>
                Edit Account & Profile
              </Typography>

              <Typography variant="subtitle2" color="textSecondary">
                Account data will be used as user authentication & Profile data
                will be used as user identity
              </Typography>
            </Grid>

            <Grid item md={6} xs={4} className={classes.image} />
          </Grid>
        </CardContent>

        <Box p={2}>
          <Grid container spacing={3}>
            <Grid item md={5} xs={12}>
              {isSkeletonShow ? (
                <Skeleton variant="rect" height={54} />
              ) : (
                <TextField
                  fullWidth
                  required
                  label="Username"
                  name="username"
                  type="text"
                  variant="outlined"
                  // disabled={loading}
                  // value={values.username}
                  // onBlur={handleBlur}
                  // onChange={handleChange}
                  // error={Boolean(touched.username && errors.username)}
                  // helperText={touched.username && errors.username}
                />
              )}
            </Grid>

            <Grid item md={5} xs={12}>
              {isSkeletonShow ? (
                <Skeleton variant="rect" height={54} />
              ) : (
                <TextField
                  fullWidth
                  required
                  label="Password"
                  name="password"
                  variant="outlined"
                  autoComplete="off"
                  type={showPassword ? 'text' : 'password'}
                  // disabled={loading}
                  // value={values.password}
                  // onBlur={handleBlur}
                  // onChange={handleChange}
                  // error={Boolean(touched.password && errors.password)}
                  // helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <CustomTooltip
                          placement="bottom"
                          title={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                        >
                          <IconButton
                            color="primary"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <VisibilityOutlinedIcon />
                            ) : (
                              <VisibilityOffOutlinedIcon />
                            )}
                          </IconButton>
                        </CustomTooltip>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            </Grid>

            <Grid item md={2} xs={12}>
              {isSkeletonShow ? (
                <Skeleton variant="rect" height={54} />
              ) : (
                <FormControlLabel
                  label="Is Active"
                  control={<Switch name="is_active" color="primary" />}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Container>
  );
};

/**
 * Default props
 */
UserEditAccountProfile.defaultProps = {
  isSkeletonShow: false
};

export default UserEditAccountProfile;
