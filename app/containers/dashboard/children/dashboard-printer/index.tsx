import { FormControl, Grid,Select, InputLabel, makeStyles, MenuItem, Checkbox, FormControlLabel } from '@material-ui/core'
import React, { useEffect, useState } from  'react'
import styled from 'styled-components'
import StaffService from '../../../../services/staff';
import moment from 'moment'
const Store = require('electron-store')
const electron = require('electron') 
const BrowserWindow = electron.remote.BrowserWindow

const store = new Store()
const Wrapper = styled.div`
  padding: 5%;
`;
const useStyles = makeStyles(()=>({
    root : {
        width:"100%"
    }
}))
const Printer = ( ) =>{ 
    const styles = useStyles()
    const [printers,setPrinters] = useState([])
    const [kitchenBill,setKitchenBill] = useState(store.get("kitchenBill")  !== undefined ? store.get("kitchenBill")  : {
        name:"",
        autoPrintWhenAcceptOrder:false,
        autoPrintStaffOrder:false,
    })
    const [orderBill,setOrderBill] = useState( store.get("orderBill") !== undefined ? store.get("orderBill") : {
        name:"",
        autoPrintWhenPayment:false,
        autoPrintWhenStaffPayment:false
    })
    useEffect(()=>{
        let win = BrowserWindow.getFocusedWindow() 
        const printers  = win?.webContents.getPrinters()
        setPrinters(printers)
    },[])
    const handleChangeBill = (event) =>{
        store.set("orderBill",{
            name: event.target.value ,
            autoPrintWhenPayment:false,
            autoPrintWhenStaffPayment:false
        })
        setOrderBill({
            ...orderBill,
            name:event.target.value,
            autoPrintWhenPayment:false,
            autoPrintWhenStaffPayment:false
        })
    }
    const handleChangeKitchenBill = (event) =>{
        store.set("kitchenBill",{
            name: event.target.value ,
            autoPrintWhenAcceptOrder:false,
            autoPrintStaffOrder:false
        })
        setKitchenBill({
            ...kitchenBill,
            name:event.target.value,
            autoPrintWhenAcceptOrder:false,
            autoPrintStaffOrder:false,
        })
    }
    const handleCheckBoxAutoPrintWhenAcceptOrder = () =>{
        store.set("kitchenBill",{
            ...kitchenBill,
            autoPrintWhenAcceptOrder:!kitchenBill.autoPrintWhenAcceptOrder,
        })
        setKitchenBill({
            ...kitchenBill,
            autoPrintWhenAcceptOrder:!kitchenBill.autoPrintWhenAcceptOrder,
        })
    }
    const handleCheckBoxAutoPrintWhenStaffOrder = () => {
        store.set("kitchenBill",{
            ...kitchenBill,
            autoPrintStaffOrder:!kitchenBill.autoPrintStaffOrder,
        })
        setKitchenBill({
            ...kitchenBill,
            autoPrintStaffOrder:!kitchenBill.autoPrintStaffOrder,
        })
    }
    const handleCheckBoxStaffPayment = () =>  {
        setOrderBill({...orderBill,
            autoPrintWhenStaffPayment:!orderBill.autoPrintWhenStaffPayment})
            store.set("orderBill",{
                ...orderBill,
                autoPrintWhenStaffPayment:!orderBill.autoPrintWhenStaffPayment
            })
    }
    const handleCheckBoxAutoPaymentBill = () =>{
        setOrderBill({...orderBill,
            autoPrintWhenPayment:!orderBill.autoPrintWhenPayment})
            store.set("orderBill",{
                ...orderBill,
                autoPrintWhenPayment:!orderBill.autoPrintWhenPayment
            })
    }
    return ( 
    <Wrapper>
            <Grid spacing={3} container>
                <Grid item xs={6}>
                <h2>Máy in Bill</h2>
                <FormControl className={styles.root}>
    <InputLabel id="demo-simple-select-label">{orderBill.name}</InputLabel>
                    <Select
                    variant="outlined"
                    label={orderBill.name}
                    classes={{root:styles.root}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={handleChangeBill}
                    >
                        {printers.map(p => (
                            <MenuItem value={p.name}>{p.name}</MenuItem>                            
                        ))}
                        
                    </Select>
                </FormControl>
                <FormControlLabel
                    control={
                    <Checkbox                     
                        name="checkedB"
                        checked={orderBill.autoPrintWhenPayment}
                        color="primary"
                        onChange={handleCheckBoxAutoPaymentBill}
                    />
                    }
                    label="Tự động in bill khi thanh toán"
                /><br/>
                 <FormControlLabel
                    control={
                    <Checkbox
                        checked={orderBill.autoPrintWhenStaffPayment}                 onChange={handleCheckBoxStaffPayment}
                        name="checkedB"
                        color="primary"
                    />
                    }
                    label="Tự động in bill khi nhân viên thanh toán từ xa"
                />
                </Grid>
                <Grid item xs={6}>
                <h2>Máy in Bếp</h2>
                <FormControl className={styles.root} >
                <InputLabel id="demo-simple-select-label">{kitchenBill.name}</InputLabel>
                    <Select
                    variant="outlined"
                    label={kitchenBill.name}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={handleChangeKitchenBill}
                    >
                      {printers.map(p => (
                            <MenuItem value={p.name}>{p.name}</MenuItem>                            
                        ))}
                    </Select>
                </FormControl>
                <FormControlLabel
                    control={
                    <Checkbox                     
                        name="checkedB"
                        color="primary"
                        checked={kitchenBill.autoPrintWhenAcceptOrder}
                        onChange={handleCheckBoxAutoPrintWhenAcceptOrder}
                    />
                    }
                    label="Tự động in bếp khi xác nhận order"
                /><br/>
                 <FormControlLabel
                    control={
                    <Checkbox                     
                        name="checkedB"
                        color="primary"
                        checked={kitchenBill.autoPrintStaffOrder}
                        onChange={handleCheckBoxAutoPrintWhenStaffOrder}
                    />
                    }
                    label="Tự động in bếp khi có nhân viên order từ xa"
                />
                </Grid>
            </Grid>
    </Wrapper>
        
    )
}

export default Printer