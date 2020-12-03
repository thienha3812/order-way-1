import { FormControl, Box,Typography,Grid,Select, InputLabel, makeStyles, MenuItem, Checkbox, FormControlLabel, Button, Dialog, DialogTitle, DialogActions, Paper, Tabs, Tab, TextField, DialogContent, TextareaAutosize } from '@material-ui/core'
import React, { useEffect, useState } from  'react'
import styled from 'styled-components'
const Store = require('electron-store')
const electron = require('electron') 
const BrowserWindow = electron.remote.BrowserWindow

import MoneyBoxService from '../../../../services/money-box';
import { convertToVnd } from '../../../../utils'
const store = new Store()
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

const MoneyBoxPage = (props:any) =>{ 
    const [detail,setDetail] = useState({cash:0,credit:0,e_money:0,earn:0,pay:0,fund:0})
    const [value,setValue]  = useState(0)
    const styles = useStyles()
    const fetch = async () => { 
        const {data} = await MoneyBoxService.getDetail()
        setDetail(data)
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
                                <Grid item xs={4}>
                                    <Button style={{marginRight:'10px',backgroundColor:"#444444",color:"white"}}>Đóng ngày</Button>
                                    <Button style={{backgroundColor:"#444444",color:"white"}}>Lịch sử két tiền</Button>
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
                </Grid>
                <Dialog open={true}>
                <DialogTitle>   
                    Thêm vốn đầu ngày
                </DialogTitle>
                <DialogContent>
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
                        <TextField   type="number" classes={{root:styles.root}} style={{width:"100%"}} variant="outlined" label="Số tiền mặt" />
                    </TabPanel>
                    <TabPanel  value={value} index={1}>
                        <TextField   type="number" classes={{root:styles.root}} style={{width:"100%"}} variant="outlined" label="Số tiền chuyển khoản" />
                    </TabPanel>
                    <TabPanel  value={value} index={2}>
                        <TextField  type="number" classes={{root:styles.root}} style={{width:"100%"}} variant="outlined" label="Số tiền điện tử" />
                    </TabPanel>
                    <Grid container>
                        <Grid item xs={12} style={{display:'flex'}}>
                            <TextArea  rows={4} placeholder="Tiền vốn đầu ngày"  />
                        </Grid>
                        <Grid item xs={12}>
                            <div><b>Tổng tiền cần thanh toán : </b></div>
                        </Grid>
                        <Grid item xs={12}>
                            <div><b>Tổng tiền hiện tại cần thanh toán : </b></div>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button  style={{color:"white",backgroundColor:"#ffc107"}}>Hủy</Button>
                    <Button style={{color:'white',backgroundColor:"#444444"}}>Xác nhận</Button>
                </DialogActions>
            </Dialog>
        </Wrapper>
    )
}
export default MoneyBoxPage