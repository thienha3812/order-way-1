import 'date-fns';
import React,{useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import { useStyles } from '../index';
import styled from 'styled-components'
import { Context } from '../Context';

const Wrapper = styled.div`
    margin-top:7px;
    border:1px solid #e6e6e6;
    border-radius:6px;
    width:100%;
    height:56px;
    padding-left:10px;
    .MuiInput-underline:before{
        border-bottom:0;
    }
    .MuiInput-underline:hover:not(.Mui-disabled):before{
        border-bottom:0;
    }    
  div { 
      height:100%;
  }
`
const  SelectDate = () =>  {
  const styles = useStyles()
  const {setFromDate,setToDate,fromDate,toDate}  = useContext(Context)
  const handleFromDateChange = (date) => {
    setFromDate(date)
  };

  const handleToDateChange =(date) =>{ 
      setToDate(date)
  }
  return (
    <MuiPickersUtilsProvider  utils={DateFnsUtils}>
        <Grid item xs={3}>
        <Wrapper className={styles.datePicker}>
        <KeyboardDatePicker
        label="Từ ngày"
        value={fromDate}
        onChange={date => handleFromDateChange(date)}
        format="yyyy/MM/dd"
      />
        </Wrapper>
        </Grid>
        
    
        <Grid item xs={3}>
        <Wrapper className={styles.datePicker}>
        <KeyboardDatePicker
        label="Từ ngày"
        value={toDate}
        onChange={date => handleToDateChange(date)}
        format="yyyy/MM/dd"
      />
        </Wrapper>
        </Grid>
    </MuiPickersUtilsProvider>
  );
}
export default React.memo(SelectDate)