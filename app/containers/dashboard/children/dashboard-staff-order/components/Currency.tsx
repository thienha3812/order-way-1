import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, makeStyles, TextField } from '@material-ui/core'
import React ,{Fragment,useContext,useState} from 'react'
import {GrAdd} from 'react-icons/gr'
import CustomAlert from '../../../../../components/Alert'
import { Context } from '../Context'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { convertToVnd } from '../../../../../utils'
import StaffService from '../../../../../services/staff'

const TabPanel = (props)  => {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box style={{padding:"0",marginTop:"10px"}}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
const useStyles = makeStyles(()=>({
    root : {
        padding:"0 !important"
    },
    tab: { 
        '& .MuiBox-root': {
          padding: '0px',
          },
        },

}))
const Currency = () =>{ 
    const [openDialog,setOpenDialog] = useState(false)
    const styles = useStyles()
    const [messageBox,setMessageBox] = useState({open:false,message:"",type:""})
    const {billment} = useContext(Context)
    const [value, setValue] = React.useState(0);
    const [price ,setPrice] = useState({cash:0,credit:0,e_money:0})

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    const handleCloseMessageBox = () =>{
        setMessageBox({...messageBox,open:false})
    }
    const handlePriceChange = (event,key) => {
        setPrice({...price,[key]:Number.parseInt(event.target.value)})
    }
    const caculatePrice = () =>{
        let total = billment.payment_info?.total || 0
        let current_total = price.cash  + price.credit + price.e_money
        return convertToVnd(Math.max(0,total-current_total))
    }
    const checkValid = ()  : boolean => {
        let total = billment.payment_info?.total || 0
        let current_total = price.cash  + price.credit + price.e_money
        return total === current_total && total !== 0
    }
    const updateOrder = async () =>{ 
        const {payment_info} = await StaffService.getPaymentInfo(billment.tableId)
        if(payment_info.length === 0){
            return
        }
        StaffService.updatStoreOrderInfo({
            address: payment_info?.address,
            bill_number:payment_info?.bill_number,
            bill_sequence:payment_info?.bill_sequence,
            cash: price.cash,
            content_discount: payment_info?.content_discount,
            credit:price.credit,
            cus_order_id:payment_info?.cus_order_id,
            customer_id:payment_info?.customer_id,
            customer_name:payment_info?.customer_name,
            discount_amount:payment_info?.discount_amount,
            e_money:price.e_money,
            foods:payment_info.foods,
            id:payment_info?.id,
            is_payment:payment_info?.is_payment,
            phone_number:payment_info?.phone_number,
            promotionId: billment.pmts,
            service:payment_info?.service,
            store_id:payment_info?.store_id,
            store_name:payment_info?.store_name,
            sub_total:payment_info?.sub_total,
            table_id:payment_info?.table_id,
            table_name: payment_info.table_name,
            time_in:payment_info?.time_in,
            total: payment_info.total,
            vat_percent:payment_info?.vat_percent,
            vat_value:payment_info?.vat_value
        }).then(()=>{
            setOpenDialog(false)
        }).catch(()=>{
            setOpenDialog(false)
        })
    }   
    return ( 
        <Fragment>
            <div style={{ display: "flex", alignItems: "center" }}>
            <div><b>Loại tiền: </b></div>
            <div>
            <IconButton
                onClick={()=>setOpenDialog(true)}
                  style={{ color: "black", borderRadius: 0 }}

            >
            <GrAdd />
            </IconButton>
            </div>
            </div>
            <Dialog onClose={()=>setOpenDialog(false)} open={openDialog}>
                <DialogTitle>   
                    Loại tiền thanh toán
                </DialogTitle>
                <DialogContent>
                <Paper >
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label="Tiền mặt" />
                        <Tab label="Chuyển khoản" />
                        <Tab label="Tiền điện tử" />

                    </Tabs>
                    </Paper>
                    <TabPanel value={value} index={0} classes={{ root: styles.tab }}>
                        <TextField value={price.cash} onChange={(event)=>handlePriceChange(event,"cash")} type="number" classes={{root:styles.root}} style={{width:"100%"}} variant="outlined" label="Số tiền mặt" />
                    </TabPanel>
                    <TabPanel  value={value} index={1}>
                        <TextField value={price.credit} onChange={(event)=>handlePriceChange(event,"credit")}   type="number" classes={{root:styles.root}} style={{width:"100%"}} variant="outlined" label="Số tiền chuyển khoản" />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <TextField value={price.e_money}   onChange={(event)=>handlePriceChange(event,"e_money")} type="number" classes={{root:styles.root}} style={{width:"100%"}} variant="outlined" label="Số tiền điện tử" />
                    </TabPanel>
                    <Grid container>
                        <Grid item xs={12}>
                            <div><b>Tổng tiền cần thanh toán : {convertToVnd(billment.payment_info?.total)}</b></div>
                        </Grid>
                        <Grid item xs={12}>
                            <div><b>Tổng tiền hiện tại cần thanh toán :{caculatePrice()}  </b></div>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button  style={{color:"white",backgroundColor:"#ffc107"}} onClick={()=>setOpenDialog(false)}>Hủy</Button>
                    <Button style={{color:'white',backgroundColor:"#444444"}} onClick={updateOrder} disabled={!checkValid()}>Xác nhận</Button>
                </DialogActions>
            </Dialog>
            <CustomAlert type={messageBox.type} closeMessage={handleCloseMessageBox} message={messageBox.message} open={messageBox.open} />      
        </Fragment>
    )
}

export default Currency