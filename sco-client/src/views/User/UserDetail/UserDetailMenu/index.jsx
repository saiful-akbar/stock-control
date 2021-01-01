import React from 'react';
import { connect } from 'react-redux';
import {
  Card,
  CardHeader,
  CardContent,
  SvgIcon,
  Collapse,
  Typography
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import PropTypes from 'prop-types';
import {
  fade,
  makeStyles,
  withStyles
} from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { useSpring, animated } from 'react-spring/web.cjs';


/**
 * Icon minus untuk tree
 * @param {*} props 
 */
function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}


/**
 * Icon plus untuk tree
 * @param {*} props 
 */
function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}


/**
 * Icon close untuk ttree
 * @param {*} props 
 */
function CloseSquare(props) {
  return (
    <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}


/**
 * Animasi transisi tree
 * @param {*} props 
 */
function TransitionComponent(props) {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}


/**
 * Tipe properti untuk komponent TransitionComponent
 */
TransitionComponent.propTypes = {
  // Show the component; triggers the enter or exit states   
  in: PropTypes.bool,

};


/**
 * Custom TreeItem komponen
 */
const StyledTreeItem = withStyles((theme) => ({
  iconContainer: {
    '& .close': {
      opacity: 0.3,
    },
  },
  group: {
    marginLeft: 7,
    paddingLeft: 18,
    borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
  },
}))((props) => <TreeItem {...props} TransitionComponent={TransitionComponent} />);


/**
 * Style untuk komponen UserDetailMenu
 */
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    whiteSpace: 'nowrap',
  },
  content: {
    paddingBottom: theme.spacing(1),
    overflowX: 'auto',
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelText: {
    fontWeight: 'bold',
    flexGrow: 1,
    marginRight: 15,
  },
}));


/**
 * Komponen utama
 */
function UserDetailMenus({ data, ...props }) {
  const isMounted = React.useRef(true);
  const classes = useStyles();


  /**
   * Fungsi untuk menghendel jika komponent dilepas saat request api belum selesai 
   */
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    }
    // eslint-disable-next-line
  }, []);


  /**
   * Render Komponen utama
   */
  return (
    <Card
      elevation={3}
      variant={
        props.reduxTheme === 'dark'
          ? 'outlined'
          : 'elevation'
      }
    >
      <CardHeader
        title={
          data === null
            ? <Skeleton variant='text' width={120} />
            : 'Menu Access'
        }
      />

      <CardContent className={classes.content}>
        {data === null
          ? <Skeleton variant='rect' width='100%' height={145} />
          : (
            <TreeView
              className={classes.root}
              defaultExpanded={['1']}
              defaultCollapseIcon={<MinusSquare />}
              defaultExpandIcon={<PlusSquare />}
              defaultEndIcon={<CloseSquare />}
            >
              <StyledTreeItem nodeId="1" label="Main">
                <StyledTreeItem
                  nodeId='2'
                  label={
                    <div className={classes.labelRoot}>
                      <Typography variant="body2" className={classes.labelText}>
                        {'Dashboard'}
                      </Typography>
                    </div>
                  }
                />

                {data.map(dt => {
                  let menuAccess;
                  if (dt.user_m_i_read === 1) {
                    menuAccess = 'read';
                  }
                  if (dt.user_m_i_create === 1) {
                    menuAccess += ' | create';
                  }
                  if (dt.user_m_i_update === 1) {
                    menuAccess += ' | update';
                  }
                  if (dt.user_m_i_delete === 1) {
                    menuAccess += ' | delete';
                  }

                  return (
                    <StyledTreeItem
                      key={dt.id}
                      nodeId={dt.id}
                      label={
                        <div className={classes.labelRoot}>
                          <Typography variant="body2" className={classes.labelText}>
                            {dt.menu_i_title}
                          </Typography>

                          <Typography variant="caption" color="inherit">
                            {menuAccess}
                          </Typography>
                        </div>
                      }
                    >
                      {dt.sub_menus.length !== 0 && dt.sub_menus.map(sm => {
                        let subMenuAccess;
                        if (sm.user_m_s_i_read === 1) {
                          subMenuAccess = 'read';
                        }
                        if (sm.user_m_s_i_create === 1) {
                          subMenuAccess += ' | create';
                        }
                        if (sm.user_m_s_i_update === 1) {
                          subMenuAccess += ' | update';
                        }
                        if (sm.user_m_s_i_delete === 1) {
                          subMenuAccess += ' | delete';
                        }

                        return (
                          <StyledTreeItem
                            key={sm.id}
                            nodeId={sm.id}
                            label={
                              <div className={classes.labelRoot}>
                                <Typography variant="body2" className={classes.labelText}>
                                  {sm.menu_s_i_title}
                                </Typography>
                                <Typography variant="caption" color="inherit">
                                  {subMenuAccess}
                                </Typography>
                              </div>
                            }
                          />
                        )
                      })}
                    </StyledTreeItem>
                  )
                })}
              </StyledTreeItem>
            </TreeView>
          )
        }
      </CardContent>
    </Card>
  );
}


/**
 * Properti default untuk komponen UserDetailMenus
 */
UserDetailMenus.defaultProps = {
  data: null
};


/**
 * Redux State
 * @param {obj} state 
 */
function reduxState(state) {
  return {
    reduxTheme: state.theme
  }
}


export default connect(reduxState, null)(UserDetailMenus);