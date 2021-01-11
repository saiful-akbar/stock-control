import React, {
  useRef,
  useState,
  useEffect
} from 'react';
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
  Card,
  CardContent,
  Divider,
} from '@material-ui/core';
import {
  apiGetUserMenuItems,
  apiAddUserMenuItem,
  apiDeleteUserMenuItem,
} from 'src/services/user';
import { Skeleton } from '@material-ui/lab';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import BtnSubmit from 'src/components/BtnSubmit';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import DialogDelete from 'src/components/DialogDelete';
import UserMenuTable from '../UserMenuTable';


/**
 * Componen utama
 * @param {*} props 
 */
function UserMenuItems(props) {
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState(null);
  const [menuItems, setMenuItems] = useState(null);
  const [deleteData, setDeleteData] = useState({ show: false, id: [] });
  const [deleteLoading, setDeleteLoading] = useState(false);
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
      label: 'Title',
      field: 'menu_i_title',
      align: 'left'
    },
    {
      label: 'Read',
      field: 'user_m_i_read',
      align: 'center'
    },
    {
      label: 'Create',
      field: 'user_m_i_create',
      align: 'center'
    },
    {
      label: 'Update',
      field: 'user_m_i_update',
      align: 'center'
    },
    {
      label: 'Delete',
      field: 'user_m_i_delete',
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
  };


  const setValueRowData = (value) => {
    let result = [];
    value.map(dt => {
      result = [
        ...result,
        {
          id: dt.id,
          menu_i_title: dt.menu_i_title,
          user_m_i_read: menuAccess(dt.user_m_i_read),
          user_m_i_create: menuAccess(dt.user_m_i_create),
          user_m_i_update: menuAccess(dt.user_m_i_update),
          user_m_i_delete: menuAccess(dt.user_m_i_delete),
        }
      ];
      return result;
    });
    setRowData(result);
  }


  /**
   * FUngsi mengambil semua data menu item
   * Berdasarkan user yang dipilih
   */
  const getData = async () => {
    setLoading(true);
    try {
      let res = await apiGetUserMenuItems(userId);
      if (isMounted.current) {
        setLoading(false);
        setMenuItems(res.data.menu_items)
        setValueRowData(res.data.user_menu_items);
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
  const handleSubmiForm = async (data, { resetForm }) => {
    let newData = {
      user_id: userId,
      menu_item_id: data.menu_item_id,
      user_m_i_read: data.user_m_i_read ? 1 : 0,
      user_m_i_create: data.user_m_i_create ? 1 : 0,
      user_m_i_update: data.user_m_i_update ? 1 : 0,
      user_m_i_delete: data.user_m_i_delete ? 1 : 0,
    }
    try {
      let res = await apiAddUserMenuItem(userId, newData);
      if (isMounted.current) {
        setValueRowData(res.data.response.original.user_menu_items);
        resetForm({});
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
            message: `(#${err.status}) ${err.status === 422 ? err.data.message : err.data.message}`
          });
        }
      }
    }
  };


  /**
   * Fungsi untuk menghapus user menu item
   * @param {array} data
   */
  const handleDelete = async (data) => {
    setDeleteLoading(true);
    try {
      let res = await apiDeleteUserMenuItem(userId, data);
      if (isMounted.current) {
        setDeleteLoading(false);
        setValueRowData(res.data.response.original.user_menu_items);
        setDeleteData({ show: false, id: [] });
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
          setDeleteLoading(false);
          setDeleteData({ show: false, id: [] });
          props.setReduxToast({
            show: true,
            type: 'error',
            message: `(#${err.status}) ${err.data.message}`
          });
        }
      }
    }
  }


  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>

          <Formik
            initialValues={{
              menu_item_id: '',
              user_m_i_read: true,
              user_m_i_create: false,
              user_m_i_update: false,
              user_m_i_delete: false,
            }}
            validationSchema={Yup.object().shape({
              menu_item_id: Yup.string().required('Menu Item is a required field'),
              user_m_i_create: Yup.boolean(),
              user_m_i_read: Yup.boolean(),
              user_m_i_update: Yup.boolean(),
              user_m_i_delete: Yup.boolean(),
            })}
            onSubmit={handleSubmiForm}
          >
            {({
              handleBlur,
              handleChange,
              handleSubmit,
              values,
              isSubmitting
            }) => (
                <form onSubmit={handleSubmit} noValidate autoComplete='off' >
                  <Card
                    variant={props.reduxTheme === 'dark' ? 'outlined' : 'elevation'}
                    elevation={3}
                  >
                    <CardContent>
                      <Grid
                        spacing={3}
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="flex-start"
                      >
                        <Grid item md={6} xs={12}>
                          {menuItems !== null
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
                                  <MenuItem value=''>{'none'}</MenuItem>
                                  {menuItems.map(menuItem => {
                                    return (
                                      <MenuItem key={menuItem.id} value={menuItem.id}>
                                        {menuItem.menu_i_title}
                                      </MenuItem>
                                    )
                                  })}
                                </Select>
                              </FormControl>

                            ) : (
                              <Skeleton variant='rect' height={41} />
                            )}
                        </Grid>

                        <Grid item md={6} xs={12} align="center">
                          {menuItems !== null
                            ? (
                              <>
                                <FormControlLabel
                                  label='Read'
                                  control={
                                    <Checkbox
                                      name='user_m_i_read'
                                      color='primary'
                                      disabled={values.menu_item_id === '' || isSubmitting ? true : false}
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
                                      disabled={values.menu_item_id === '' || isSubmitting ? true : false}
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
                                      disabled={values.menu_item_id === '' || isSubmitting ? true : false}
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
                                      disabled={values.menu_item_id === '' || isSubmitting ? true : false}
                                      checked={values.user_m_i_delete}
                                      onChange={handleChange}
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
                      {menuItems !== null
                        ? <BtnSubmit
                          title='Add To List'
                          color='primary'
                          variant='contained'
                          type='submit'
                          singleButton={true}
                          disabled={!Boolean(values.menu_item_id)}
                          onClick={handleSubmit}
                          loading={isSubmitting}
                        />
                        : <Skeleton variant='rect' height={36} width={117} />
                      }
                    </Box>
                  </Card>
                </form>
              )}
          </Formik>
        </Grid>

        <Grid item xs={12}>
          <UserMenuTable
            action
            label='List of access rights'
            loading={loading}
            columns={columns}
            selectedRows={deleteData.id}
            rows={rowData === null ? [] : rowData}
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


export default connect(reduxState, reduxDispatch)(UserMenuItems);