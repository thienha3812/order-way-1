import React, { useEffect, useState, Fragment } from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { Grid, makeStyles,Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
const CustomAlert  = ({open,closeMessage,message,type,...rest}) => {
    const handleClose = () =>{
        closeMessage()
    }
    return(
        <Snackbar  anchorOrigin={{horizontal:"right",vertical:"bottom"}} open={open} onClose={handleClose} autoHideDuration={1000} {...rest}>
        <Alert  severity={type}>
          {message}
        </Alert>
      </Snackbar>
    )
}
export default CustomAlert 