import React from 'react';
import {
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import CustomTooltip from 'src/components/CustomTooltip';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import { apiDownloadDocument } from 'src/services/document';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';

/* Style */
const useStyles = makeStyles(theme => ({
  root: {
    padding: 10
  }
}));

/* Komponne utama */
function Tbody({
  row,
  columns,
  userAccess,
  onEdit,
  onSelect,
  setReduxToast,
  ...props
}) {
  const classes = useStyles();
  const isMounted = React.useRef(true);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  /* handle jika komponen dilepas saat request api belum selesai. */
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };

    // eslint-disable-next-line
  }, []);

  /* Fungsi untuk handle download file document */
  const handleDownload = data => {
    setLoading(true);
    apiDownloadDocument(data.id)
      .then(res => {
        if (isMounted.current) {
          setLoading(false);
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');

          link.href = url;
          link.setAttribute('download', data.document_path); //or any other extension
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      })
      .catch(err => {
        if (isMounted.current) {
          switch (err.status) {
            case 401:
              navigate('/logout');
              break;

            case 403:
              navigate('/error/forbiden');
              break;

            case 404:
              navigate('/error/notfound');
              break;

            default:
              setLoading(false);
              setReduxToast(
                true,
                'error',
                `(#${err.status}) ${err.data.message}`
              );
              break;
          }
        }
      });
  };

  /* Render komponen utama */
  return (
    <TableRow {...props}>
      {/* Cell checkbox */}
      {Boolean(userAccess !== null && userAccess.user_m_s_i_delete === 1) && (
        <TableCell padding="checkbox">
          <CustomTooltip placement="bottom" title="Select">
            <Checkbox
              color="primary"
              checked={props.selected}
              onClick={e => onSelect(e, row.id)}
            />
          </CustomTooltip>
        </TableCell>
      )}

      {/* Cell data document */}
      {columns.map((col, key) => (
        <TableCell
          key={key}
          className={classes.root}
          padding={
            Boolean(userAccess !== null && userAccess.user_m_s_i_delete === 1)
              ? 'checkbox'
              : 'default'
          }
        >
          {row[col.field]}
        </TableCell>
      ))}

      {/* Cell actions download, edit & delete */}
      {Boolean(userAccess !== null) && (
        <TableCell padding="checkbox" align="center">
          {loading ? (
            <IconButton disabled>
              <CircularProgress size={20} />
            </IconButton>
          ) : (
            <CustomTooltip placement="bottom" title="Download">
              <IconButton onClick={() => handleDownload(row)}>
                <CloudDownloadOutlinedIcon fontSize="small" />
              </IconButton>
            </CustomTooltip>
          )}

          {userAccess.user_m_s_i_update === 1 && (
            <CustomTooltip placement="bottom" title="Edit">
              <IconButton onClick={() => onEdit(row)}>
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </CustomTooltip>
          )}
        </TableCell>
      )}
    </TableRow>
  );
}

/* default props */
Tbody.defaultProps = {
  row: {},
  columns: [],
  userAccess: null,
  onEdit: e => e.preventDefault(),
  onSelect: e => e.preventDefault()
};

/* Redux reducer */
function reduxDispatch(dispatch) {
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

export default connect(null, reduxDispatch)(Tbody);
