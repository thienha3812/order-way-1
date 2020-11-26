import { MenuItem,Select,FormControl,InputLabel } from '@material-ui/core'
import React, { useContext, useEffect,useState } from  'react'
import { Context } from '../Context'
import {useStyles} from '../index'
import TableService from '../../../../../services/tables';
import { Table } from '../../dashboard-staff-order/types';


const SelectType = () =>{ 
  const {setTable,table} = useContext(Context)
    const styles= useStyles()
    const [tables,setTables] = useState<Table[]>([])
    const fetch = async () =>{
      const response = await TableService.listByCounter()
      setTables([{pk:null,model:"",fields:{name:"Tất cả",parent_id:0,parent_name:"",status:0}},...response.data])
    }
    useEffect(()=>{
      fetch()
    },[])
    const handleChange = (event) =>{ 
      setTable(event.target.value)
  }
    return ( 
        <FormControl variant="outlined" classes={{root:styles.root}}  className={styles.formControl}>
        <InputLabel  classes={{marginDense:styles.root}} id="demo-simple-select-outlined-label" >Bàn</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          label="Bàn"
          value={table == null ? {value:"Tất cả"} : table}
          onChange={handleChange}
        >
          {tables.map((l)=> ( 
            <MenuItem  value={l.pk}>{l.fields.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    )
}

export default React.memo(SelectType)