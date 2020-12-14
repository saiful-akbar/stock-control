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
  colors,
  CardContent,
  Divider,
  Card,
} from '@material-ui/core';
import {
  apiAddUserMenuSubItem,
  apiGetUserMenuSubItems,
  apiDeleteUserMenuSubItems,
} from 'src/services/user';
import UserMenuTable from '../UserMenuTable';
import { Skeleton } from '@material-ui/lab';
import { reduxAction } from 'src/config/redux/state';
import BtnSubmit from 'src/components/BtnSubmit';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import DialogDelete from 'src/components/DialogDelete';


/**
 * Komponen utama
 * @param {*} props 
 */
function UserMenuSubItems(props) {
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState(null);
  const [menus, setMenus] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteData, setDeleteData] = useState({ show: false, id: [] });

  const isMounted = useRef(true);

  /**
   * User id
   */
  const { userId } = props;


  /**
   * Data kolom pada tabel list
   */
  const columns = [
    {
      label: 'Menus Title',
      field: 'menu_i_title',
      align: 'left'
    },
    {
      label: 'Sub Menus Title',
      field: 'menu_s_i_title',
      align: 'left'
    },
    {
      label: 'Read',
      field: 'user_m_s_i_read',
      align: 'center'
    },
    {
      label: 'Create',
      field: 'user_m_s_i_create',
      align: 'center'
    },
    {
      label: 'Update',
      field: 'user_m_s_i_update',
      align: 'center'
    },
    {
      label: 'Delete',
      field: 'user_m_s_i_delete',
      align: 'center'
    },
  ];


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
   * Fungsi untuk menyesuaikan data dengan row table dan menyimpan kedalam state rowData
   * @param {array} data 
   */
  const setValueRowData = (data) => {
    let result = [];
    data.map(dt => {
      result = [
        ...result,
        {
          id: dt.id,
          menu_i_title: dt.menu_i_title,
          menu_s_i_title: dt.menu_s_i_title,
          user_m_s_i_read: menuAccess(dt.user_m_s_i_read),
          user_m_s_i_create: menuAccess(dt.user_m_s_i_create),
          user_m_s_i_update: menuAccess(dt.user_m_s_i_update),
          user_m_s_i_delete: menuAccess(dt.user_m_s_i_delete),
        }
      ];
      return result;
    })
    setRowData(result);
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
        setMenus(res.data.menus);
        setValueRowData(res.data.user_menu_sub_items);
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
            message: `(#${err.status}) ${err.data.message}`
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
  const handleSubmiForm = async (data, { resetForm, setFieldValue }) => {
    let newData = {
      user_id: userId,
      menu_sub_item_id: data.menu_sub_item_id,
      user_m_s_i_read: data.user_m_s_i_read ? 1 : 0,
      user_m_s_i_create: data.user_m_s_i_create ? 1 : 0,
      user_m_s_i_update: data.user_m_s_i_update ? 1 : 0,
      user_m_s_i_delete: data.user_m_s_i_delete ? 1 : 0,
    };

    try {
      let res = await apiAddUserMenuSubItem(userId, newData);
      if (isMounted.current) {
        resetForm();
        setFieldValue('menu_item_id', data.menu_item_id);
        setValueRowData(res.data.response.original.user_menu_sub_items);
        props.setReduxToast({
          show: true,
          type: 'success',
          message: res.data.message,
        });
      }
    } catch (err) {
      if (isMounted.current) {
        if (err.status === 401) {
          window.location.href = '/logout';
        }
        else {
          setLoading(false);
          props.setReduxToast({
            show: true,
            type: 'error',
            message: `(#${err.status}) ${err.status === 422 ? err.data.message : err.statusText}`
          });
        }
      }
    }
  };


  /**
   * Fungsi untuk menghapus user menu sub items
   * @param {arrya} data 
   */
  const handleDelete = async (data = []) => {
    setDeleteLoading(true);
    try {
      let res = await apiDeleteUserMenuSubItems(userId, data);
      if (isMounted.current) {
        setDeleteLoading(false);
        setValueRowData(res.data.response.original.user_menu_sub_items);
        setDeleteData({ show: false, id: [] });
        props.setReduxToast({
          show: true,
          type: 'success',
          message: res.data.message,
        });
      }
    } catch (err) {
      if (isMounted.current) {
        console.log(err);
        if (err.status === 401) {
          window.location.href = '/logout';
        }
        else {
          setDeleteLoading(false);
          setDeleteData({ show: false, id: deleteData.id });
          props.setReduxToast({
            show: true,
            type: 'error',
            message: `(#${err.status}) ${err.statusText}`
          });
        }
      }
    }
  }


  return (
    <>
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
                                <InputLabel id='menu-items' margin='dense'>{'Menus'}</InputLabel>
                                <Select
                                  label='Menus'
                                  labelId='menu-items'
                                  name='menu_item_id'
                                  margin='dense'
                                  disabled={isSubmitting}
                                  value={values.menu_item_id}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                >
                                  <MenuItem value=''>
                                    <em>{'none'}</em>
                                  </MenuItem>

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
                              <Skeleton variant='rect' height={41} />
                            )}
                        </Grid>

                        <Grid item lg={6} xs={12}>
                          {menus !== null
                            ? (
                              <FormControl
                                fullWidth
                                variant='outlined'
                              >
                                <InputLabel id='menu-sub-items' margin='dense'>{'Sub Menus'}</InputLabel>
                                <Select
                                  label='Sub Menus'
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
                              <Skeleton variant='rect' height={41} />
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
                                      checked={values.user_m_s_i_read}
                                      onChange={handleChange}
                                      disabled={Boolean(values.menu_sub_item_id === '' || isSubmitting)}
                                    />
                                  }
                                />
                                <FormControlLabel
                                  label='Create'
                                  control={
                                    <Checkbox
                                      name='user_m_s_i_create'
                                      color='primary'
                                      checked={values.user_m_s_i_create}
                                      onChange={handleChange}
                                      disabled={Boolean(values.menu_sub_item_id === '' || isSubmitting)}
                                    />
                                  }
                                />
                                <FormControlLabel
                                  label='Update'
                                  control={
                                    <Checkbox
                                      name='user_m_s_i_update'
                                      color='primary'
                                      checked={values.user_m_s_i_update}
                                      onChange={handleChange}
                                      disabled={Boolean(values.menu_sub_item_id === '' || isSubmitting)}
                                    />
                                  }
                                />
                                <FormControlLabel
                                  label='Delete'
                                  control={
                                    <Checkbox
                                      name='user_m_s_i_delete'
                                      color='primary'
                                      checked={values.user_m_s_i_delete}
                                      onChange={handleChange}
                                      disabled={Boolean(values.menu_sub_item_id === '' || isSubmitting)}
                                    />
                                  }
                                />
                              </>
                            ) : (
                              <Skeleton variant='rect' height={41} />
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
          <UserMenuTable
            action
            label='List of access rights'
            loading={loading}
            columns={columns}
            rows={rowData === null ? [] : rowData}
            selectedRows={deleteData.id === null ? [] : deleteData.id}
            onDelete={selected => {
              setDeleteData({
                show: true,
                id: selected,
              });
            }}
          />
        </Grid>
      </Grid>

      <DialogDelete
        open={deleteData.show}
        loading={deleteLoading}
        onDelete={() => handleDelete(deleteData.id)}
        onClose={bool => {
          setDeleteData({
            show: bool,
            id: [],
          });
        }}
      />
    </>
  );
};


/**
 * Redux dispatch
 * @param {dispatch} dispatch 
 */
function reduxDispatch(dispatch) {
  return {
    setReduxToast: (error) => dispatch({
      type: reduxAction.toast,
      value: error
    })
  }
};


/**
 * redux state
 */
function reduxState(state) {
  return {
    reduxTheme: state.theme
  }
}


export default connect(reduxState, reduxDispatch)(UserMenuSubItems);