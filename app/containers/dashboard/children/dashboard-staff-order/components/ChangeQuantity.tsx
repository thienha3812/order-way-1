import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core'
import React,{useState} from 'react'
import { convertToVnd } from '../../../../../utils'




const ChangeQuantityDialog = ({onClose,open,...rest}) =>{ 
    const {price,quantity}  = rest
    const [newQuantity,setQuantity] = useState(null)
    const handleClose = props =>{
        onClose(props)
    }
    return (
        <Dialog open={open} disableBackdropClick disableEscapeKeyDown onClose={onClose}>
            <DialogTitle>
                Thay đổi số lượng
            </DialogTitle>
            <DialogContent>              
                <form>
                    <p>Số lượng cũ</p>
                    <TextField  disabled value={quantity} variant="outlined" /><br/>
                    <p>Số lượng mới</p>
                    <TextField   variant="outlined" onChange={(event)=> setQuantity(event.target.value)} /><br/>
                </form>
            </DialogContent>
            <DialogActions>
                <Button  style={{color:"white",backgroundColor:"#ffc107"}} onClick={()=>handleClose({canceled:true})}>Hủy</Button>
                <Button style={{color:"white",backgroundColor:"#444444"}} onClick={()=>handleClose({...rest,newQuantity:Number(newQuantity),canceled:false})}>Xác nhận</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ChangeQuantityDialog