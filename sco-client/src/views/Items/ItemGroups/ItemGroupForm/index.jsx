import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Zoom
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import BtnSubmit from "src/components/BtnSubmit";


/**
 * Animasi transisi
 */
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});


/**
 * Komponen utama
 */
function ItemGroupForm(props) {
  /**
   * State
   */
  const [loading, setLoading] = React.useState(false);
  const [values, setValues] = React.useState({ group_code: "", group_name: "" });


  /**
   * Handle close dialog
   */
  const handleClose = () => {
    if (!loading) {
      props.onClose();
    } else {
      return;
    }
  }


  /**
   * Handle saat form diisi
   */
  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
    let newValues = { ...values };
    newValues[e.target.name] = e.target.value;
    setValues(newValues);
  }


  /**
   * Handle saat form di submit
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }

  return (
    <Dialog
      fullWidth
      scroll="paper"
      maxWidth="md"
      TransitionComponent={Transition}
      open={props.open}
      onClose={handleClose}
    >
      <DialogTitle>
        {`${props.type} item group`}
      </DialogTitle>

      <Alert severity="info">Form with * is required</Alert>

      <DialogContent>
        <form onSubmit={handleSubmit} autoComplete="off">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="group-code"
                label="Group Code *"
                variant="outlined"
                name="group_code"
                type="text"
                margin="dense"
                disabled={loading}
                onChange={handleChange}
                value={values.group_code}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={5}
                margin="dense"
                id="group-name"
                label="Group Name *"
                variant="outlined"
                name="group_name"
                type="text"
                disabled={loading}
                onChange={handleChange}
                value={values.group_name}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <BtnSubmit
          variant="contained"
          title={props.type === "Add" ? "Add" : "Update"}
          loading={loading}
          handleCancel={handleClose}
          handleSubmit={handleSubmit}
        />
      </DialogActions>
    </Dialog>
  )

}


/**
 * Default props untuk komponent ItemGroupForm
 */
ItemGroupForm.defaultProps = {
  data: {},
  open: false,
  onClose: (e) => e.preventDefault(),
};


export default ItemGroupForm;