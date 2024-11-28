import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
    flex: {
      flex: 1,
    },
  }));
  
  const Header = (props) => {
    const classes = useStyles();
  
    return (
      <div className={classes.margin}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5" color="inherit" className={classes.flex}>
              카카오톡 웹
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  };
  
  export default Header;