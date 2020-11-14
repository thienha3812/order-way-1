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
            value:"f",
            label:"Chưa thanh toán"
        },
        {
            value: "t",
            label:"Đã thanh toán"
        },        
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