import { MenuItem,Select,FormControl,InputLabel } from '@material-ui/core'
import React, { useContext } from  'react'
import {useStyles} from '..'
import { Context } from '../Context'

const SelectStatus = () =>{ 
    const {setStatus,status}  = useContext(Context)
    const styles= useStyles()
    const labels  = [
        {
            value:"all",
            label:"Tất cả"
        },
        {
            value: "created",
            label:"Đã gửi"
        },
        {
            value: "approved",
            label:"Đã xác nhận"
        },{
            value: "doing",
            label:"Đang làm"
        },{
            value: "done",
            label:"Đã xong"
        },{
            value: "finished",
            label:"Đã hoàn thành"
        },{
            value: "canceled",
            label:"Đã hủy"
        }
    ]
    const handleChange = (event) =>{ 
        setStatus(event.target.value)
    }
    return ( 
        <FormControl variant="outlined" classes={{root:styles.root}}  className={styles.formControl}>
        <InputLabel  classes={{marginDense:styles.root}} id="demo-simple-select-outlined-label" >Trạng thái</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          label="Trạng thái"
          value={status || "" } 
          onChange={handleChange}
        >
          {labels.map((l)=> ( 
            <MenuItem value={l.value}>{l.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    )
}

export default React.memo(SelectStatus)