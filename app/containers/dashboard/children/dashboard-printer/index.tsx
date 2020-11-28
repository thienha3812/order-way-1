import { FormControl, Grid,Select, InputLabel, makeStyles, MenuItem, Checkbox, FormControlLabel } from '@material-ui/core'
import React, { useEffect, useState } from  'react'
import styled from 'styled-components'
const Store = require('electron-store')
const electron = require('electron') 
const BrowserWindow = electron.remote.BrowserWindow

const store = new Store()
const Wrapper = styled.div`
  padding: 5%;
  margin-top:40px;
`;
const useStyles = makeStyles(()=>({
    root : {
        width:"100%"
    }
}))
const Printer = ( ) =>{ 
    const styles = useStyles()
    const [printers,setPrinters] = useState([])
    const arrFontSize = Array.from(new Array(21).keys()).filter(v => v>=10)
    const [kitchenBill,setKitchenBill] = useState(store.get("kitchenBill")  !== undefined ? store.get("kitchenBill")  : {
        name:"",
        autoPrintWhenAcceptOrder:false,
        autoPrintStaffOrder:false,    
        fontSizeKitchenBill:null,
    })
    const [orderBill,setOrderBill] = useState( store.get("orderBill") !== undefined ? store.get("orderBill") : {
        name:"",
        autoPrintWhenPayment:false,
        autoPrintWhenStaffPayment:false,
        fontSizeOrderBill:null
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
    const handleFontSizeBillChange  = event => {
        setOrderBill({...orderBill,
            fontSizeOrderBill:event.target.value
        })
        store.set("orderBill",{
            ...orderBill,
            fontSizeOrderBill:event.target.value
        })
    }
    const handleFontSizeKitchenBillChange = event => {
        setKitchenBill({
            ...kitchenBill,
            fontSizeKitchenBill:event.target.value
        })
        store.set("kitchenBill",{
            ...kitchenBill,
            fontSizeKitchenBill: event.target.value,
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
                <FormControl className={styles.root} style={{marginTop:"10px"}}>
                    <InputLabel id="demo-simple-select-label">Kích cỡ chữ</InputLabel>
                    <Select
                    variant="outlined"
                    classes={{root:styles.root}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={orderBill.fontSizeOrderBill || null}
                    onChange={handleFontSizeBillChange}
                    >
                        {arrFontSize.map(f => (
                            <MenuItem value={f}>{f}</MenuItem>                            
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
                        checked={orderBill.autoPrintWhenStaffPayment}                
                        onChange={handleCheckBoxStaffPayment}
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
                <FormControl className={styles.root} style={{marginTop:"10px"}}>
                    <InputLabel id="demo-simple-select-label">Kích cỡ chữ</InputLabel>
                    <Select
                    variant="outlined"
                    classes={{root:styles.root}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={kitchenBill.fontSizeKitchenBill|| null}
                    onChange={handleFontSizeKitchenBillChange}
                    >
                        {arrFontSize.map(f => (
                            <MenuItem value={f}>{f}</MenuItem>                            
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