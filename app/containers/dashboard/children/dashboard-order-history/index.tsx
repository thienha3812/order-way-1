import { Grid,MenuItem,Button,Menu,Select,FormControl,InputLabel,TextField, makeStyles, Divider } from '@material-ui/core'
import React, { useMemo, useState } from  'react'
import styled from 'styled-components'
import StaffService from '../../../../services/staff';
import MaterialUIPickers from './components/SelectDate';
import SelectStatus from './components/SelectStatus';
import SelectType from './components/SelectType';
import { Provider } from './Context';
import moment from 'moment'
import Pagination from '../../../../components/Pagination';
import OrderDetail from '../../../../components/OrderDetail';
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


const OrderHistory = ( ) =>{ 
    const [status,setStatus]  = useState('')
    const [type,setType]  = useState('')
    const styles = useStyles()
    const history = useHistory()
    const [fromDate,setFromDate] = useState(new Date())
    const [toDate,setToDate] = useState(new Date())
    const [orders,setOrders] = useState({orders:[],total_row:0})
    const filter = async () => {
      const response  = await StaffService.searchOrderHistory({fromDate : moment(fromDate).format("YYYY-MM-DD"),offset:0,toDate:moment(toDate).format("YYYY-MM-DD"),limit:10,status,type})
      setOrders(response.data)
    }
    const handleSelectPage =  async (index) =>{
      const response  = await StaffService.searchOrderHistory({fromDate : moment(fromDate).format("YYYY-MM-DD"),offset:(index-1)*10,toDate:moment(toDate).format("YYYY-MM-DD"),limit:10,status,type})
      setOrders(response.data)
    }
    return ( 
      <Provider value={{
        setStatus,
        setType,
        status,
        type,
        fromDate,
        setFromDate,
        setToDate,
        toDate
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
            <h2>Lịch sử Order</h2>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={3}>
              <SelectStatus/>
          </Grid>
          <Grid item xs={3}>
          <SelectType/>
          </Grid>
          <MaterialUIPickers/>
          <Grid item xs={12} >
           <p className={styles.root}>Có {orders.total_row | 0} kết quả</p>
          <Button variant="contained" onClick={filter}  style={{backgroundColor:"#444444",color:'#fff',left:"90%"}}>
            Lọc
          </Button>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
              {orders.orders.map((order,index)=> ( 
                <div style={{marginBottom:"10px"}}>
                <OrderDetail {...order} />
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

export default OrderHistory