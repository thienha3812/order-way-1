import React,{Fragment, useEffect, useState} from 'react'
import QrReader from 'react-qr-reader'

import {IoMdQrScanner} from 'react-icons/io'
import {BsSearch} from 'react-icons/bs'
import {GrAdd} from 'react-icons/gr'
import { Button, Dialog, IconButton,DialogTitle, DialogContent, Grid,TextField, DialogActions } from '@material-ui/core'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import StaffService from '../../../../../services/staff'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MasterService from '../../../../../services/master'
import CustomerService, { AddCustomerByStaffDTO } from '../../../../../services/customer'
const validate = require("validate.js");
import CustomAlert from '../../../../../components/Alert';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import styled from 'styled-components'
import moment from 'moment'
import { useStyles } from '../../dashboard-bill-history'
const Wrapper = styled.div`
    margin-top:7px;
    border:1px solid #e6e6e6;
    border-radius:6px;
    height:56px;
    padding-left:10px;
    .MuiInput-underline:before{
        border-bottom:0;
    }
    .MuiIconButton-root{
        margin-left:-60px !important;
    }
    .MuiInput-underline:after{
        border-bottom:0;
    }
    .MuiInput-underline:hover:not(.Mui-disabled):before{
        border-bottom:0;
    }    
  div { 
      height:100%;
  }
`

const CustomerPayment =  () => { 
    const styles = useStyles()
    const [openScanQr,setOpen] = useState(false)
    const [customer,setCustomer] = useState('')
    const [phone_number,setPhone] = useState('')
    const [openSearchDialog,setOpenSearchDialog] = useState(false)
    const [customers,setCustomers] = useState<any[]>([])
    const [citis,setCitis] = useState<any[]>([])
    const [openAddCustomer,setOpenAddCustomer] = useState(false)
    const [districts,setDistricts] = useState<any[]>([])
    const [messageBox,setMessageBox] = useState({open:false,message:"",type:""})
    const [error,setError] = useState({error_phone_number:true,error_name:true,error_birth_day:true,error_district:true,error_city:true})
    const [form,setForm] = useState<AddCustomerByStaffDTO>({city_id:0,birthday:"",district_id:0,gender:"1",name:"",phone:"",phone_number:""})
    useEffect(()=>{
        navigator.mediaDevices.getUserMedia({video: true}).then(()=>{
        })
        fetch()
    },[])
    useEffect(()=>{
        if(form.phone !== "" && error.error_phone_number){
            if(validatePhoneNumber(form.phone)){
                setError({...error,error_phone_number:false})
            }            
        }
        if(form.name !== "" && error.error_name){
            setError({...error,error_name:false})
        }
        if(form.birthday !== "" && error.error_birth_day){
            setError({...error,error_birth_day:false})
        }        
        if(form.city_id !== 0 && error.error_city){
            setError({...error,error_city:false})
        }
        if(form.district_id !== 0 && error.error_district){
            setError({...error,error_district:false})
        }
    },[form,error])
    const fetch = async () =>{
        const {data} = await MasterService.getCity()
        setCitis(data)
    }
    const handleScan = data => {
        if (data) {
            setOpen(false)
            setCustomer(data.split("-")[2])
        }
      }
    const handleCloseMessageBox =() =>{
        setMessageBox({open:false,message:"",type:"info"})
    }
    const  handleError = err => {
        console.error(err)
      }
    const handleSearchInput =(event) =>{
        setPhone(event.target.value)
    }
    const handleSearchCustomer = async () =>{
        const {data} = await StaffService.searchCustomer({phone_number})
        setCustomers(data)
    }
    const handleSelectCustomer = (customer) =>{
        setCustomer(customer.phone_number)
        setOpenSearchDialog(false)
    }
    const handleSelectCity = async (event) =>{
        setForm({...form,city_id:event.target.value})
        const {data}  = await MasterService.getDistrict(event.target.value)
        setDistricts(data)
    }
    const handleAddCustomer = async () =>{
        CustomerService.addCustomerByStaff(form).then(()=>{
            setMessageBox({message:"Thêm khách hàng thành công!",open:true,type:"success"})
            setOpenAddCustomer(false)
        }).catch(err=>{
            const {mess} = JSON.parse(err.request.response)
            setMessageBox({open:true,message:mess,type:"error"}) 
        })
    }
    const validatePhoneNumber = (phoneNumber:string) =>{
        const vnf_regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
        if(vnf_regex.test(phoneNumber) == false){
            return false
        }
        return true
    }
    
    return ( 
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Fragment>
          <div style={{display:"flex",alignItems:'center'}}>
              <div>
                  Khách hàng: {customer}
            </div>
              <IconButton onClick={()=>setOpen(!openScanQr)} style={{color:"black",borderRadius:0}}>
                  <IoMdQrScanner/>
              </IconButton>
              <IconButton onClick={()=>setOpenSearchDialog(true)} style={{color:"black",borderRadius:0}}>
                  <BsSearch/>
              </IconButton>
              <IconButton onClick={()=>setOpenAddCustomer(true)} style={{color:"black",borderRadius:0}}>
                  <GrAdd/>
              </IconButton>
          </div>
          <Dialog open={openAddCustomer} fullWidth maxWidth="md">
                <DialogTitle> 
                    Thêm khách hàng
                </DialogTitle>
                <DialogContent>
                <TextField id="name-input" error={error.error_name} helperText={error.error_name && "Tên không hợp lệ!"} style={{marginTop:"10px"}} label="Tên" onChange={(event)=>setForm({...form,name:event.target.value})} fullWidth  variant="outlined" /> 
                <TextField id="phone-input"  style={{marginTop:"10px"}} error={error.error_phone_number} value={form.phone_number} helperText={error.error_phone_number && "Số điện thoại không hợp lệ!"}  label="Số điện thoại" onChange={(event)=> setForm({...form,phone:event.target.value,phone_number:event.target.value})} fullWidth  variant="outlined" />                        
                <FormControl style={{marginTop:"10px"}} fullWidth variant="outlined">
                    <InputLabel>Giới tính</InputLabel>
                    <Select
                    onChange={(event)=> setForm({...form,gender:event.target.value})}
                    value={form.gender}
                    label="Giới tính"
                    >
                        <MenuItem value={"1"}>Nam</MenuItem>
                        <MenuItem value={"2"}>Nữ</MenuItem>
                        <MenuItem value={"3"}>Khác</MenuItem>
                    </Select>
                </FormControl>
                <Wrapper>
                    <KeyboardDatePicker
                    placeholder="Ngày sinh"
                    error={error.error_birth_day}
                    value={form.birthday}
                    helperText={error.error_birth_day && "Ngày sinh không hợp lệ"}
                    format="MM-dd-yyyy"
                    onChange={(time)=> setForm({...form,birthday:time}) }
                />
                    </Wrapper>

                <FormControl error={error.error_city} style={{marginTop:"20px"}} fullWidth variant="outlined">
                    <InputLabel >Tỉnh/thành phố</InputLabel>
                    <Select
                        onChange={handleSelectCity}
                        value={form?.city_id || ""}
                        label="Tỉnh/thành phố"
                    >
                        {citis.map((citi,index)=>(
                            <MenuItem key={index} value={citi.pk}>{citi.fields.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl error={error.error_district} style={{marginTop:"10px"}} fullWidth variant="outlined">
                    <InputLabel >Quận/huyện</InputLabel>
                    <Select
                        onChange={(event)=> setForm({...form,district_id:Number(event.target.value)})}
                        label="Quận/huyện"
                        value={form?.district_id || ""}
                    >
                        {districts.map((district,index)=>(
                            <MenuItem key={index} value={district.pk}>{district.fields.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setOpenAddCustomer(false)}>Hủy</Button>
                    <Button disabled={error.error_birth_day || error.error_city || error.error_district || error.error_name || error.error_phone_number}  onClick={handleAddCustomer}>Đăng ký</Button>
                </DialogActions>
          </Dialog>
          <Dialog open={openSearchDialog} onClose={()=>setOpenSearchDialog(false)} fullWidth >
                <DialogTitle>
                    Tìm kiếm khách hàng
                </DialogTitle>
                <DialogContent>
                    <Grid container justify="space-between" spacing={4}>
                        <Grid item xs={3}>
                            <h4>Số điện thoại</h4>
                        </Grid>
                        <Grid item xs={6}>
                        <TextField id="outlined-basic" label="Tìm kiếm số điện thoại" onChange={handleSearchInput} fullWidth  variant="outlined" />                        
                        </Grid>
                        <Grid item xs={2}>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                <IconButton onClick={handleSearchCustomer} style={{color:"black",borderRadius:0}}>
                                    <BsSearch/>
                                </IconButton>                            
                                </Grid>
                                <Grid item xs={6}>
                                    <IconButton onClick={()=>setOpen(true)} style={{color:"black",borderRadius:0}}>
                                        <GrAdd/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table  >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>STT</TableCell>
                                        <TableCell align="center">Số điện thoại	</TableCell>
                                        <TableCell align="center">Tên</TableCell>
                                        <TableCell align="center">Tiền tích lũy	</TableCell>
                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {customers.map((row) => (
                                        <TableRow key={row.index}>
                                        <TableCell component="th" scope="row">
                                            {row.index}
                                        </TableCell>
                                        <TableCell align="center">{row.phone_number}</TableCell>
                                        <TableCell align="center">{row.name}</TableCell>
                                        <TableCell align="center">{row.total_money}</TableCell>
                                        <TableCell align="center">
                                            <Button onClick={()=>handleSelectCustomer(row)} color="secondary" variant="outlined">Chọn</Button>
                                        </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>

                            </Table>
                        </TableContainer>
                        </Grid>
                    </Grid>
                </DialogContent>
          </Dialog>
          <CustomAlert type={messageBox.type} closeMessage={handleCloseMessageBox} message={messageBox.message} open={messageBox.open} />      


          {openScanQr && (
              <div>
              <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ position:'absolute',top:"50%",left:"50%",transform:"translate(-50%, -50%)",height:"400px",width:"400px" }}
            />
            </div>
          )}
        </Fragment>
        </MuiPickersUtilsProvider>
    )
}




export default CustomerPayment

