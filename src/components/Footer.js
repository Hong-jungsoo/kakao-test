import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
  link: {
    textDecoration: "none",
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.root} elevation={0}>
        <Typography component="p" variant="body1">
          <a href="https://cpro95.tistory.com/50" className={classes.link}>
            링크 : 튜토리얼 보기
          </a>
        </Typography>
        <Typography component="p" variant="body2">
          카카오톡 API와 React, Material-UI로 만들었습니다.
        </Typography>
      </Paper>
    </div>
  );
};

export default Footer;
