import React, {
  useRef,
  useState,
  useEffect
} from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  InputLabel,
  FormControl,
  Paper,
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import UserMenuTable from './UserMenuTable';
import { apiGetUserMenuItems } from 'src/services/user';
import { Skeleton } from '@material-ui/lab';

const UserMenuItems = (props) => {
  const { userId } = props;
  const isMounted = useRef(true);
  const columns = [
    { label: 'Title', field: 'menu_i_title' },
    { label: 'Read', field: 'user_m_i_read' },
    { label: 'Cread', field: 'user_m_i_create' },
    { label: 'Update', field: 'user_m_i_update' },
    { label: 'Delete', field: 'user_m_i_delete' },
  ]

  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);


  useEffect(() => {
    if (rowData === null) {
      getData();
    }
    return () => {
      isMounted.current = false;
    }
    // eslint-disable-next-line
  }, []);


  // Mengambil semua menu akses sesuai user id dari api
  const getData = async () => {
    setLoading(true);
    try {
      let res = await apiGetUserMenuItems(userId);
      if (isMounted.current) {
        setLoading(false);
        setMenuItems(res.data.menu_items)

        let result = [];
        res.data.user_menu_items.map((data, key) => {
          result = [
            ...result,
            {
              id: data.id,
              menu_i_title: data.menu_i_title,
              user_m_i_read: data.pivot.user_m_i_read === 1 ? 'Yes' : 'No',
              user_m_i_create: data.pivot.user_m_i_create === 1 ? 'Yes' : 'No',
              user_m_i_update: data.pivot.user_m_i_update === 1 ? 'Yes' : 'No',
              user_m_i_delete: data.pivot.user_m_i_delete === 1 ? 'Yes' : 'No',
            }
          ];
          return result;
        })
        setRowData(result);
      }
    } catch (err) {
      if (isMounted.current) {
        setLoading(false);
        console.log(err);
      }
    }
  }


  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper elevation={3}>
          <Box p={2}>
            <Formik
              initialValues={{
                menu_item_id: '',
                user_m_i_read: true,
                user_m_i_create: false,
                user_m_i_update: false,
                user_m_i_delete: false,
              }}
              validationSchema={Yup.object().shape({
                menu_item_id: Yup.string().required(),
                user_m_i_create: Yup.boolean(),
                user_m_i_read: Yup.boolean(),
                user_m_i_update: Yup.boolean(),
                user_m_i_delete: Yup.boolean(),
              })}
              onSubmit={() => alert('submitting')}
            >
              {({
                handleBlur,
                handleChange,
                handleSubmit,
                values,
              }) => (
                  <form onSubmit={handleSubmit} noValidate autoComplete='off' >
                    <Grid
                      spacing={3}
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                    >
                      <Grid item lg={5} xs={12}>
                        {menuItems.length > 0
                          ? (
                            <FormControl
                              fullWidth
                              variant='outlined'
                            >
                              <InputLabel id='menu-items'>Menu Items</InputLabel>
                              <Select
                                label='Menu Items'
                                labelId='menu-items'
                                name='menu_item_id'
                                value={values.menu_item_id}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              >
                                <MenuItem value=''><em>none</em></MenuItem>
                                {menuItems.map((data, key) => (
                                  <MenuItem key={key} value={data.id}>{data.menu_i_title}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                          ) : (
                            <Skeleton variant='rect' height={55} />
                          )}
                      </Grid>

                      <Grid item lg={5} xs={12} align="center">
                        {menuItems.length > 0
                          ? (
                            <>
                              <FormControlLabel
                                label='Read'
                                control={
                                  <Checkbox
                                    name='user_m_i_read'
                                    color='primary'
                                    disabled={values.menu_item_id === '' ? true : false}
                                    checked={values.user_m_i_read}
                                    onChange={handleChange}
                                  />
                                }
                              />

                              <FormControlLabel
                                label='Create'
                                control={
                                  <Checkbox
                                    name='user_m_i_create'
                                    color='primary'
                                    disabled={values.menu_item_id === '' ? true : false}
                                    checked={values.user_m_i_create}
                                    onChange={handleChange}
                                  />
                                }
                              />

                              <FormControlLabel
                                label='Update'
                                control={
                                  <Checkbox
                                    name='user_m_i_update'
                                    color='primary'
                                    disabled={values.menu_item_id === '' ? true : false}
                                    checked={values.user_m_i_update}
                                    onChange={handleChange}
                                  />
                                }
                              />

                              <FormControlLabel
                                label='Delete'
                                control={
                                  <Checkbox
                                    name='user_m_i_delete'
                                    color='primary'
                                    disabled={values.menu_item_id === '' ? true : false}
                                    checked={values.user_m_i_delete}
                                    onChange={handleChange}
                                  />
                                }
                              />
                            </>
                          ) : (
                            <Skeleton variant='rect' height={30} />
                          )}

                      </Grid>

                      <Grid item lg={2} xs={12} align="center">
                        {menuItems.length > 0
                          ? (
                            <Button
                              color='primary'
                              variant='contained'
                              type='submit'
                              disabled={values.menu_item_id === '' ? true : false}
                              startIcon={
                                <AddCircleOutlineIcon />
                              }
                            >
                              Add to list
                            </Button>

                          ) : (
                            <Skeleton variant='rect' height={37} />
                          )}
                      </Grid>
                    </Grid>
                  </form>
                )}
            </Formik>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <UserMenuTable
          loading={loading}
          columns={columns}
          rows={rowData === null ? [] : rowData}
        />
      </Grid>
    </Grid>
  );
};

export default UserMenuItems;