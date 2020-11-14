import { MenuItem,Select,FormControl,InputLabel } from '@material-ui/core'
import React, { useContext } from  'react'
import { Context } from '../Context'
import {useStyles} from '../index'



const SelectType = () =>{ 
  const {setType,type} = useContext(Context)

    const styles= useStyles()
    const labels  = [
        {
          value:"all",
          label:"Tất cả"
        },
        {
            value: "order",
            label:"Order"
        },
        {
            value: "request",
            label:"Yêu cầu"
        },{
            value: "cancel_food",
            label:"Hủy món"
        },{
            value: "cancel_order",
            label:"Hủy Order"
        }
    ]
    const handleChange = (event) =>{ 
      setType(event.target.value)
  }
    return ( 
        <FormControl variant="outlined" classes={{root:styles.root}}  className={styles.formControl}>
        <InputLabel  classes={{marginDense:styles.root}} id="demo-simple-select-outlined-label" >Loại</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          label="Loại"
          value={type}
          onChange={handleChange}
        >
          {labels.map((l)=> ( 
            <MenuItem value={l.value}>{l.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    )
}

export default React.memo(SelectType)