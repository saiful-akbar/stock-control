import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { apiDeleteItemGroup } from 'src/services/itemGroups';
import DialogDelete from 'src/components/DialogDelete';

/**
 * Komponent utama
 */
function ItemGroupDelete(props) {
  const navigate = useNavigate();
  const isMounted = React.useRef(true);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  /**
   * Handle jika komponen dilepas saat request api belum selesai
   */
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };

    // eslint-disable-next-line
  }, []);

  /**
   * Fungsi untuk menutup dialog delete
   * @param {*} e
   */
  const handleCloseDialog = e => {
    if (!loading) props.onClose();
  };

  /**
   * Fungsi untuk submit delete
   */
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await dispatch(apiDeleteItemGroup(props.selected));
      if (isMounted.current) {
        setLoading(false);
        handleCloseDialog();
      }
    } catch (err) {
      if (isMounted.current) {
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
      }
    }
  };

  return (
    <DialogDelete
      open={props.open}
      loading={loading}
      onDelete={handleSubmit}
      onClose={handleCloseDialog}
    />
  );
}

ItemGroupDelete.defaultProps = {
  open: false,
  selected: [],
  onClose: () => {}
};

export default ItemGroupDelete;
