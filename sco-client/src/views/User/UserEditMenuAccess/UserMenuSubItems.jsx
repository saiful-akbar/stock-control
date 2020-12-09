import React, {
  useRef,
  useState,
  useEffect,
} from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Grid,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  InputLabel,
  FormControl,
  Paper,
  colors,
  ListSubheader,
  CardContent,
  Divider,
  Card,
} from '@material-ui/core';
import {
  apiGetUserMenuSubItems,
  apiAddUserMenuItem,
  apiDeleteUserMenuItem,
} from 'src/services/user';
import UserMenuTable from './UserMenuTable';
import { Skeleton } from '@material-ui/lab';
import { reduxAction } from 'src/config/redux/state';
import BtnSubmit from 'src/components/BtnSubmit';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import DialogDelete from 'src/components/DialogDelete';
import DataTable from 'src/components/DataTable';


/**
 * Komponen utama
 * @param {*} props 
 */
function UserMenuSubItems(props) {
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState(null);
  const [menus, setMenus] = useState(null);
  // const [deleteData, setDeleteData] = useState({ show: false, id: null });
  // const [deleteLoading, setDeleteLoading] = useState(false);
  const isMounted = useRef(true);

  /**
   * User id
   */
  const { userId } = props;


  useEffect(() => {
    if (rowData === null) {
      getData();
    }
    return () => {
      isMounted.current = false;
    }
    // eslint-disable-next-line
  }, []);


  /**
   * Tambilan menu akses true atau false
   * @param {boolean} access 
   */
  const menuAccess = (access) => {
    if (access === 1) {
      return <CheckIcon style={{ color: colors.green[500] }} />
    } else {
      return <CloseIcon style={{ color: colors.red[500] }} />
    }
  }


  /**
   * FUngsi mengambil semua data menu item
   * Berdasarkan user yang dipilih
   */
  const getData = async () => {
    setLoading(true);
    try {
      let res = await apiGetUserMenuSubItems(userId);
      if (isMounted.current) {
        setLoading(false);
        setMenus(res.data.menus)
        let result = [];
        res.data.user_menu_sub_items.map((data, key) => {
          result = [
            ...result,
            {
              id: data.id,
              menu_i_title: data.menu_i_title,
              menu_s_i_title: data.menu_s_i_title,
              user_m_s_i_read: menuAccess(data.user_m_s_i_read),
              user_m_s_i_create: menuAccess(data.user_m_s_i_create),
              user_m_s_i_update: menuAccess(data.user_m_s_i_update),
              user_m_s_i_delete: menuAccess(data.user_m_s_i_delete),
            }
          ];
          return result;
        })
        setRowData(result);
      }
    } catch (err) {
      if (isMounted.current) {
        if (err.status === 401) {
          window.location.href = 'logout';
        } else {
          setLoading(false);
          props.setReduxToast({
            show: true,
            type: 'error',
            message: `(#${err.status}) ${err.statusText}`
          });
        }
      }
    }
  }


  /**
   * FUngsi submit menambah user menu item baru
   * @param {object} data 
   * @param {function} param1 
   */
  const handleSubmiForm = async (data, { resetForm }) => {
    // let newData = {
    //   user_id: userId,
    //   menu_item_id: data.menu_item_id,
    //   user_m_i_read: data.user_m_i_read ? 1 : 0,
    //   user_m_i_create: data.user_m_i_create ? 1 : 0,
    //   user_m_i_update: data.user_m_i_update ? 1 : 0,
    //   user_m_i_delete: data.user_m_i_delete ? 1 : 0,
    // }
    // try {
    //   let res = await apiAddUserMenuItem(userId, newData);
    //   if (isMounted.current) {
    //     getData();
    //     resetForm({});
    //     props.setReduxToast({
    //       show: true,
    //       type: 'success',
    //       message: res.data.message,
    //     });
    //   }
    // } catch (err) {
    //   if (isMounted.current) {
    //     if (err.status === 401) {
    //       window.location.href = '/logout';
    //     }
    //     else {
    //       setLoading(false);
    //       props.setReduxToast({
    //         show: true,
    //         type: 'error',
    //         message: `(#${err.status}) ${err.status === 422 ? err.data.message : err.statusText}`
    //       });
    //     }
    //   }
    // }
  };


  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card
          variant={props.reduxTheme === 'dark' ? 'outlined' : 'elevation'}
          elevation={3}
        >
          <Formik
            initialValues={{
              menu_item_id: '',
              menu_sub_item_id: '',
              user_m_s_i_read: true,
              user_m_s_i_create: false,
              user_m_s_i_update: false,
              user_m_s_i_delete: false,
            }}
            validationSchema={Yup.object().shape({
              menu_item_id: Yup.string().required('Menu Item is a required field'),
              menu_sub_item_id: Yup.string().required('Menu Sub Item is a required field'),
              user_m_s_i_read: Yup.boolean(),
              user_m_s_i_create: Yup.boolean(),
              user_m_s_i_update: Yup.boolean(),
              user_m_s_i_delete: Yup.boolean(),
            })}
            onSubmit={handleSubmiForm}
          >
            {({
              handleBlur,
              handleChange,
              handleSubmit,
              values,
              errors,
              isSubmitting
            }) => (
                <form onSubmit={handleSubmit} noValidate autoComplete='off' >
                  <CardContent>
                    <Grid
                      spacing={3}
                      container
                      direction="row"
                      justify="flex-end"
                      alignItems="center"
                    >
                      <Grid item lg={6} xs={12}>
                        {menus !== null
                          ? (
                            <FormControl
                              fullWidth
                              variant='outlined'
                            >
                              <InputLabel id='menu-items' margin='dense'>Menu Items</InputLabel>
                              <Select
                                label='Menu Items'
                                labelId='menu-items'
                                name='menu_item_id'
                                margin='dense'
                                disabled={isSubmitting}
                                value={values.menu_item_id}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              >
                                <MenuItem value=''><em>none</em></MenuItem>
                                {menus.map(item => {
                                  return (
                                    <MenuItem
                                      key={item.id}
                                      value={item.id}
                                    >
                                      {item.menu_i_title}
                                    </MenuItem>
                                  )
                                })}
                              </Select>
                            </FormControl>

                          ) : (
                            <Skeleton variant='rect' height={38} />
                          )}
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        {menus !== null
                          ? (
                            <FormControl
                              fullWidth
                              variant='outlined'
                            >
                              <InputLabel id='menu-sub-items' margin='dense'>Menu Sub Items</InputLabel>
                              <Select
                                label='Menu Sub Items'
                                labelId='menu-sub-items'
                                name='menu_sub_item_id'
                                margin='dense'
                                disabled={isSubmitting}
                                value={values.menu_sub_item_id}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              >
                                <MenuItem value=''><em>none</em></MenuItem>
                                {menus.map(item => {
                                  if (values.menu_item_id === item.id) {
                                    return item.menu_sub_items.map(subItem => (
                                      <MenuItem
                                        key={subItem.id}
                                        value={subItem.id}
                                      >
                                        {subItem.menu_s_i_title}
                                      </MenuItem>
                                    ))
                                  }
                                  return null;
                                })}
                              </Select>
                            </FormControl>

                          ) : (
                            <Skeleton variant='rect' height={38} />
                          )}
                      </Grid>

                      <Grid item lg={6} xs={12} align="right">
                        {menus !== null
                          ? (
                            <>
                              <FormControlLabel
                                label='Read'
                                control={
                                  <Checkbox
                                    name='user_m_s_i_read'
                                    color='primary'
                                    disabled={values.menu_sub_item_id === '' || isSubmitting ? true : false}
                                    checked={values.user_m_s_i_read}
                                    onChange={handleChange}
                                  />
                                }
                              />
                              <FormControlLabel
                                label='Create'
                                control={
                                  <Checkbox
                                    name='user_m_s_i_create'
                                    color='primary'
                                    disabled={values.menu_sub_item_id === '' || isSubmitting ? true : false}
                                    checked={values.user_m_s_i_create}
                                    onChange={handleChange}
                                  />
                                }
                              />
                              <FormControlLabel
                                label='Update'
                                control={
                                  <Checkbox
                                    name='user_m_s_i_update'
                                    color='primary'
                                    disabled={values.menu_sub_item_id === '' || isSubmitting ? true : false}
                                    checked={values.user_m_s_i_update}
                                    onChange={handleChange}
                                  />
                                }
                              />
                              <FormControlLabel
                                label='Delete'
                                control={
                                  <Checkbox
                                    name='user_m_s_i_delete'
                                    color='primary'
                                    disabled={values.menu_sub_item_id === '' || isSubmitting ? true : false}
                                    checked={values.user_m_s_i_delete}
                                    onChange={handleChange}
                                  />
                                }
                              />
                            </>
                          ) : (
                            <Skeleton variant='rect' height={38} />
                          )}
                      </Grid>
                    </Grid>
                  </CardContent>

                  <Divider />

                  <Box
                    display='flex'
                    justifyContent='flex-end'
                    p={2}
                  >
                    <BtnSubmit
                      title='Add To List'
                      color='primary'
                      variant='contained'
                      type='submit'
                      singleButton={true}
                      disabled={!Boolean(values.menu_sub_item_id)}
                      onClick={handleSubmit}
                      loading={isSubmitting}
                    />
                  </Box>
                </form>
              )}
          </Formik>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <DataTable />
      </Grid>
    </Grid>
  );
};


/**
 * redux state
 */
function reduxState(state) {
  return {
    reduxTheme: state.theme
  }
}


export default connect(reduxState, null)(UserMenuSubItems);