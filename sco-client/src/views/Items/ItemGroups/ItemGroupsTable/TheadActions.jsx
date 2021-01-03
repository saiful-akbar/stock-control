import React from "react";
import {
  Grid,
  Button,
  Box,
  IconButton,
  Typography,
  Toolbar,
  FormControl,
  OutlinedInput,
  InputAdornment,
  InputLabel,
} from "@material-ui/core";
import { makeStyles, lighten } from "@material-ui/core/styles";
import clsx from "clsx";
import CustomTooltip from "src/components/CustomTooltip";
import RefreshIcon from "@material-ui/icons/Refresh";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import DeleteIcon from '@material-ui/icons/Delete';


/**
 * Style untuk komponen utama
 */
const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    marginBottom: theme.spacing(2),
  },
  highlight:
    theme.palette.type === "light"
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: "1 1 100%",
    marginLeft: theme.spacing(2),
  },
  buttonDelete: {
    marginRight: theme.spacing(2),
  }
}));


/**
 * Komponnet utama
 */
function TheadActions({
  selected,
  loading,
  searchValue,
  onReload,
  onSearch,
  ...props
}) {
  const classes = useStyles();


  /**
   * State
   */
  const [search, setSearch] = React.useState("");


  /**
   * Handle submit form search
   */
  const handleSubmitSearch = (e) => {
    e.preventDefault();
    onSearch(search);
  }


  /**
   * Handle blur foem search
   */
  const handleBlurSearch = (e) => {
    if (searchValue !== search) {
      onSearch(search);
    } else {
      e.preventDefault();
    }
  }


  /**
   * Render komponent utama
   */
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: Boolean(selected.length > 0),
      })}
    >
      {selected.length > 0
        ? (
          <React.Fragment>
            <Typography
              className={classes.title}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {selected.length} {"selected"}
            </Typography>

            <CustomTooltip title="Delete" placement="bottom">
              <IconButton className={classes.buttonDelete}>
                <DeleteIcon />
              </IconButton>
            </CustomTooltip>
          </React.Fragment>
        ) : (
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            spacing={3}
          >
            <Grid item lg={4} md={6} xs={12}>
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Box
                  mr={1}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <CustomTooltip title="Mode options" placement="bottom">
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  </CustomTooltip>

                  <CustomTooltip title="Reload" placement="bottom">
                    <IconButton onClick={onReload}>
                      <RefreshIcon />
                    </IconButton>
                  </CustomTooltip>
                </Box>

                <Button
                  fullWidth
                  color="primary"
                  variant="contained"
                >
                  {"Add Item Group"}
                </Button>
              </Box>
            </Grid>

            <Grid item lg={8} md={6} xs={12}>
              <form onSubmit={handleSubmitSearch} autoComplete="off" >
                <FormControl fullWidth margin="dense" variant="outlined">
                  <InputLabel htmlFor="search">{"Search item groups"}</InputLabel>
                  <OutlinedInput
                    label="Search item groups"
                    id="search"
                    name="search"
                    type="text"
                    value={search}
                    disabled={loading}
                    onBlur={e => handleBlurSearch(e)}
                    onChange={e => setSearch(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </form>
            </Grid>
          </Grid>
        )}
    </Toolbar>
  )
}


/**
 * Default props komponen TheadActions
 */
TheadActions.defaultProps = {
  selected: [],
  loading: false,
  searchValue: "",
  onReload: (e) => e.preventDefault(),
  onSearch: (e) => e.preventDefault(),
};


export default TheadActions;