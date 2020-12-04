import { Box,Typography,Grid,makeStyles, Button, Dialog, DialogTitle, DialogActions, Paper, Tabs, Tab, TextField, DialogContent } from '@material-ui/core'
import React, { useCallback, useEffect, useState } from  'react'
import styled from 'styled-components'
import moment from 'moment'
import MoneyBoxService from '../../../../services/money-box';
import { convertToVnd } from '../../../../utils'
import { useHistory } from 'react-router';
import { DASHBOARD_MONEY_BOX_HISTORY } from '../../../../constants/routes';
import CustomAlert from '../../../../components/Alert';

const Wrapper = styled.div`
  padding: 5%;
  margin-top:40px;
  border:1px solid #3333;
  border-radius:15px;
  font-size:16px;
`;
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
const TextArea = styled.textarea`
    width:100%;
    height:250px;
    border-radius:5px;
    border:1px solid #e0e0e0;
    margin-top:5px;
    &:focus {
        outline:none;
    }
    &::placeholder{ 
        font-size: 16px;
    }
    padding:10px;
    font-size:16px;
`
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

const MoneyBoxPage = () =>{ 
    const [detail,setDetail] = useState({cash:0,credit:0,e_money:0,earn:0,pay:0,fund:0})
    const [value,setValue]  = useState(0)
    const [closeJobInDay,setCloseJobInDay] = useState(false)
    const [formAddMoney,setFormAddMoney] = useState({cash:0,credit:0,e_money:0,moneyContent:'',moneyNumber:0,toDay:'',type:''})
    const [openAddDailyMoney,setOpenAddDailyMoney] = useState(false)
    const [openAddFund,setOpenAddFund] = useState(false)
    const [openMoneyOut,setOpenMoneyOut] = useState(false)
    const [messageBox, setMessageBox] = useState({
        open: false,
        message: "",
        type: "",
      });
      
    const history = useHistory()
    const styles = useStyles()
    const handleCloseAll = () =>{
        setOpenAddDailyMoney(false)
        setOpenAddFund(false)
        setOpenMoneyOut(false)
        resetForm()
    }
    const fetch = async () => { 
        const {data} = await MoneyBoxService.getDetail(moment().format("YYYY-MM-DD"))
        setDetail(data)
    }
    const addMoney = () =>{
        if(openAddDailyMoney){
            MoneyBoxService.add({moneyContent:formAddMoney.moneyContent,cash:formAddMoney.cash,credit:formAddMoney.credit,e_money:formAddMoney.e_money,moneyNumber:formAddMoney.moneyNumber,toDay:moment().format('YYYY-MM-DD'),type:'fund'}).then(({data})=>{
                handleCloseAll()
                resetForm()
                setDetail(data)
            })
        }
        if(openAddFund){
            MoneyBoxService.add({moneyContent:formAddMoney.moneyContent,cash:formAddMoney.cash,credit:formAddMoney.credit,e_money:formAddMoney.e_money,moneyNumber:formAddMoney.moneyNumber,toDay:moment().format('YYYY-MM-DD'),type:'plus'}).then(({data})=>{
                handleCloseAll()
                resetForm()
                setDetail(data)
            })
        }
        if(openMoneyOut){
            MoneyBoxService.add({moneyContent:formAddMoney.moneyContent,cash:formAddMoney.cash,credit:formAddMoney.credit,e_money:formAddMoney.e_money,moneyNumber:formAddMoney.moneyNumber,toDay:moment().format('YYYY-MM-DD'),type:'minus'}).then(({data})=>{
                handleCloseAll()
                resetForm()
                setDetail(data)
            })
        }
    }
    const handleCloseDay = async () => {
        MoneyBoxService.closeDay().then(()=>{
            setMessageBox({open:true,message:"Đóng ngày thành công",type:"success"})
            setCloseJobInDay(false)
            setDetail({cash:0,credit:0,e_money:0,earn:0,pay:0,fund:0})
        })
    }
    const resetForm =  () =>{
        setFormAddMoney({cash:0,credit:0,e_money:0,moneyContent:'',moneyNumber:0,toDay:'',type:''})
    }
    const moneyNeeedToPay  = useCallback(()=>{
        const money = formAddMoney.moneyNumber - formAddMoney.cash - formAddMoney.e_money - formAddMoney.credit
        return money < 0 ? 0 : money
    },[formAddMoney])
    const handleCloseMessageBox = () =>{
        setMessageBox({...messageBox,open:false})
    }
    useEffect(()=>{
        fetch()
    },[])
    return ( 
        <Wrapper>
                <Grid container>
                        <Grid item xs={12} style={{textAlign:"center"}} >
                                <h2>Két tiền</h2>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container justify="flex-end">
                                <Grid item xs={3} style={{textAlign:"end"}}>
                                    <Button style={{marginRight:'10px',width:"150px",backgroundColor:"#444444",color:"white"}} onClick={()=>setCloseJobInDay(true)}>Đóng ngày</Button>
                                </Grid>
                                <Grid item xs={3} style={{textAlign:"end"}}>
                                    <Button onClick={()=> history.push(DASHBOARD_MONEY_BOX_HISTORY) } style={{backgroundColor:"#444444",width:"150px",color:"white"}}>Lịch sử két tiền</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={4}>
                                <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                        <div>
                                            <h2>Tiền mặt</h2>
                                        </div>
                                        <div>
                                            <h1>{convertToVnd(detail.cash)} </h1>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={4}>
                                <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                        <div>
                                            <h2>Tài khoản thẻ</h2>
                                        </div>
                                        <div>
                                            <h1>{convertToVnd(detail.credit)}</h1>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={4}>
                                <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                        <div>
                                            <h2>Tiền điện tử</h2>
                                        </div>
                                        <div>
                                            <h1>{convertToVnd(detail.e_money)}</h1>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} style={{borderTop:"1px solid #e6e6e6"}}>
                            <Grid container>
                                <Grid item xs={4}>
                                <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                        <div>
                                            <h2>Vốn đầu ngày</h2>
                                        </div>
                                        <div>
                                            <h1>{convertToVnd(detail.fund)} </h1>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={4}>
                                <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                        <div>
                                            <h2>Tổng thu</h2>
                                        </div>
                                        <div>
                                            <h1>{convertToVnd(detail.earn)}</h1>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={4}>
                                <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                        <div>
                                            <h2>Tổng chi</h2>
                                        </div>
                                        <div>
                                            <h1>{convertToVnd(detail.pay)}</h1>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={4} style={{display:'flex',justifyContent:'center'}}>
                                    <Button style={{marginRight:'10px',backgroundColor:"#444444",color:"white"}} onClick={()=>setOpenAddDailyMoney(true)}>Thêm vốn đầu ngày</Button>
                                </Grid>
                                <Grid item xs={4} style={{display:'flex',justifyContent:'center'}}>
                                    <Button style={{marginRight:'10px',backgroundColor:"#444444",color:"white"}} onClick={()=>setOpenAddFund(true)}>Thêm tiền thu</Button>
                                </Grid>
                                <Grid item xs={4} style={{display:'flex',justifyContent:'center'}}>
                                    <Button style={{marginRight:'10px',backgroundColor:"#444444",color:"white"}} onClick={()=>setOpenMoneyOut(true)}>Thêm tiền chi</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                </Grid>
                <Dialog open={openAddDailyMoney || openAddFund || openMoneyOut}>
                <DialogTitle>   
                    {openAddDailyMoney && "Thêm vốn đầu ngày"}
                    {openAddFund && "Thêm tiền thu"}
                    {openMoneyOut && "Thêm tiền chi"}
                </DialogTitle>
                <DialogContent>
               
                    <Grid container>
                        <Grid item xs={12}>
                            <TextField onChange={(event)=> setFormAddMoney({...formAddMoney,moneyNumber:Number(event.target.value)})}   type="number" classes={{root:styles.root}} style={{width:"100%"}} variant="outlined" label="Số tiền vốn" />
                        </Grid>
                        <Grid item xs={12} style={{display:'flex'}}>
                            <TextArea  onChange={(event)=> setFormAddMoney({...formAddMoney,moneyContent:event.target.value})} rows={4} placeholder="Nội dung thêm"  />
                        </Grid>
                    </Grid>
                    <Paper >
                    <Tabs
                        value={value}
                        onChange={(event,value) => setValue(value)}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                        style={{padding:"0"}}
                    >
                        <Tab label="Tiền mặt" />
                        <Tab label="Chuyển khoản" />
                        <Tab label="Tiền điện tử" />

                    </Tabs>
                    </Paper>
                    <TabPanel value={value} index={0} classes={{ root: styles.tab }}>
                        <TextField onChange={(event)=> setFormAddMoney({...formAddMoney,cash:Number(event.target.value)})}   type="number" classes={{root:styles.root}} style={{width:"100%"}}  variant="outlined" placeholder={formAddMoney.cash.toString()} />
                    </TabPanel>
                    <TabPanel  value={value} index={1}>
                        <TextField onChange={(event)=> setFormAddMoney({...formAddMoney,credit:Number(event.target.value)})}   type="number" classes={{root:styles.root}} style={{width:"100%"}}  variant="outlined" placeholder={formAddMoney.credit.toString()} />
                    </TabPanel>
                    <TabPanel  value={value} index={2}>
                        <TextField onChange={(event)=> setFormAddMoney({...formAddMoney,e_money: Number(event.target.value)})}  type="number" classes={{root:styles.root}} style={{width:"100%"}} variant="outlined" placeholder={formAddMoney.e_money.toString()} />
                    </TabPanel>
                    <Grid container>
                        <Grid item xs={12}>
                            <div><b>Tổng tiền cần thanh toán: {formAddMoney.moneyNumber}</b></div>
                        </Grid>
                        <Grid item xs={12}>
                            <div><b>Tổng tiền hiện tại cần thanh toán: {moneyNeeedToPay()} </b></div>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAll} style={{color:"white",backgroundColor:"#ffc107"}}>Hủy</Button>
                    <Button onClick={addMoney} disabled={(formAddMoney.moneyNumber - formAddMoney.cash - formAddMoney.e_money - formAddMoney.credit) ? true : false} style={{color:'white',backgroundColor:"#444444"}}>Xác nhận</Button>
                </DialogActions>
            </Dialog>
            <Dialog BackdropProps={{
              style:{
                  backgroundColor:"transparent"
              }
          }} open={closeJobInDay}>
                <DialogContent>
                Bạn có chắc muốn đóng ca làm việc cuối ngày?
                </DialogContent>
                <DialogActions>
                    <Button  onClick={()=> setCloseJobInDay(false)} style={{color:"white",backgroundColor:"#ffc107"}}>
                        Hủy
                    </Button>
                    <Button onClick={handleCloseDay} style={{color:"white",backgroundColor:"#444444"}}>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
            <CustomAlert
                type={messageBox.type}
                closeMessage={handleCloseMessageBox}
                message={messageBox.message}
                open={messageBox.open}
            />
        </Wrapper>
    )
}
export default MoneyBoxPage