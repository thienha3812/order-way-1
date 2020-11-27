import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core'
import React,{useState} from 'react'
import { convertToVnd } from '../../../../../utils'




const ChangePriceDialog = ({onClose,open,...rest}) =>{ 
    const {price,quantity}  = rest
    const [newPrice,setNewPrice] = useState(null)
    const handleClose = props =>{
        onClose(props)
        setNewPrice(null)
    }
    return (
        <Dialog open={open} disableBackdropClick disableEscapeKeyDown onClose={onClose}>
            <DialogTitle>
                Thay đổi giá
            </DialogTitle>
            <DialogContent>              
                <form>
                    <p>Giá cũ</p>
                    <TextField  disabled value={convertToVnd(price)} variant="outlined" /><br/>
                    <p>Giá mới</p>
                    <TextField onBlur={(event)=> event.target.value = convertToVnd(newPrice)} onFocus={(event)=> event.target.value = newPrice}  variant="outlined" onChange={(event)=> setNewPrice(event.target.value)} /><br/>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>handleClose({canceled:true})}>Hủy</Button>
                <Button onClick={()=>handleClose({...rest,newPrice,canceled:false})}>Xác nhận</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ChangePriceDialog