import React, { Fragment, useContext, useEffect, useState } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Order } from '../types';
import { Context } from '../Context';
import TableService from '../../../../../services/tables';
import { Checkbox, DialogActions,Button } from '@material-ui/core';

const MergeTable = () =>{ 
    const {setOpenMergeTable} = useContext(Context)
    const [tables,setTables]= useState([])
    useEffect(()=>{ 
        fetch()
    },[])
    const fetch = async () =>{ 
        let data = await TableService.listByCounter()
        data.data.forEach((table)=>{
            table.selected = false
        })
        setTables(data.data)
    }
    const handleChange = (table) =>{ 
        let _tables = tables
        _tables.forEach(t=>{ 
            if(table.pk == t.pk){
                t.selected = !t.selected
            }
        })
        setTables([...tables])
    }
    return ( 
        <Fragment>
            <Dialog maxWidth="sm" fullWidth  open={true}>
                <DialogContent>
                    <div style={{textAlign:'center'}}>
                        <h2>Gộp bàn</h2>
                    </div>
                    <ul style={{listStyleType:"none"}}>
                        {tables.map((table,index)=>(
                            <li><Checkbox onChange={()=>handleChange(table)} color="primary" checked={table.selected} />{table.fields.name}</li>
                        ))}
                    </ul>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setOpenMergeTable(false)}>Hủy</Button>
                    <Button>Xác nhận</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}

export default MergeTable