import { Grid,Button,makeStyles, Divider } from '@material-ui/core'
import React, { useState } from  'react'
import styled from 'styled-components'
import StaffService from '../../../../services/staff';
import MaterialUIPickers from './components/SelectDate';
import SelectStatus from './components/SelectStatus';
import SelectTable from './components/SelectTable';
import { Provider } from './Context';
import moment from 'moment'
import Pagination from '../../../../components/Pagination';
import PhoneInput from './components/PhoneInput';
import BillDetail from '../../../../components/BillDetail';
import { useHistory } from 'react-router';


const Wrapper = styled.div`
  padding: 5%;
  margin-top:80px;
`;
export const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root : {
    width:'100%',
    margin: theme.spacing(1), 
  },
  datePicker:{
    margin: theme.spacing(1), 
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));


const BillHistory = ( ) =>{ 
    const [status,setStatus]  = useState('')
    const [table,setTable]  = useState<number | null>(null)
    const [phone,setPhone]  = useState('')
    const styles = useStyles()
    const history  = useHistory()
    const [fromDate,setFromDate] = useState(new Date())
    const [toDate,setToDate] = useState(new Date())
    const [orders,setOrders] = useState({orders:[],total_row:0})
    const filter = async () => {
      const response  = await StaffService.searchBillHistory({fromDate : moment(fromDate).format("YYYY-MM-DD"),offset:0,toDate:moment(toDate).format("YYYY-MM-DD"),limit:10,status,phoneNumber:phone,table})
      setOrders(response.data)
    }
    const handleSelectPage =  async (index) =>{
      const response  = await StaffService.searchBillHistory({fromDate : moment(fromDate).format("YYYY-MM-DD"),offset:(index-1)*10,toDate:moment(toDate).format("YYYY-MM-DD"),limit:10,status,phoneNumber:phone,table})
      setOrders(response.data)
    }
    return ( 
      <Provider value={{
        setStatus,
        setTable,
        status,
        table,
        fromDate,
        setFromDate,
        setToDate,
        toDate,
        phone,
        setPhone
      }}>
        <Wrapper>
        <Grid container justify="center">
          <Grid item xs={12}  style={{display:"flex",justifyContent:"start"}}>
            
            <Grid container justify="flex-start">
              <Button variant="contained" onClick={()=>history.go(-1)} style={{color:'white',backgroundColor:"#444444"}}>
                Quay lại
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={3} style={{textAlign:"center"}}>
            <h2>Lịch sử Bill</h2>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <SelectTable/>
          </Grid>
          <Grid item xs={4}>
            <SelectStatus/>
          </Grid>
          <Grid item xs={4}>
            <PhoneInput/>
          </Grid>
          <MaterialUIPickers/>
          <Grid item xs={12} >
           <p className={styles.root}>Có {orders.total_row | 0} kết quả</p>
          <Button variant="contained" onClick={filter} style={{color:'white',backgroundColor:"#444444",left:"90%"}}>
            Lọc
          </Button>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
              {orders.orders.map((order)=> ( 
                <div style={{marginBottom:"10px"}}>
                <BillDetail {...order} />
                <div style={{marginBottom:"10px"}}></div>
                <Divider/>
                </div>
              ))}
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Grid item xs={6} >
            {orders.total_row > 0 && (
              <Pagination pageCount={Math.ceil(orders.total_row/10)} onSelect={handleSelectPage} />
            )}
          </Grid>
          </Grid>
      </Wrapper>
      </Provider>
        
    )
}

export default BillHistory