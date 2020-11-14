import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useStyles } from '..';
import { Context } from '../Context';


const  PhoneInput = ()  => {
    const styles = useStyles()
    const {setPhone} = useContext(Context)
  return (
      <form className={styles.root}>
        <TextField onChange={event=>setPhone(event.target.value)}  style={{width:"100%"}} id="outlined-basic" label="Số điện thoại khách hàng" variant="outlined" />
      </form>
  );
}
export default PhoneInput
