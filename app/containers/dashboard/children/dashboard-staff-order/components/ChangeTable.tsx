import React, { Fragment, useContext, useEffect, useState } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Context } from '../Context';
import TableService from '../../../../../services/tables';
import { Checkbox, DialogActions,Button } from '@material-ui/core';
import CustomAlert from '../../../../../components/Alert';
import StaffService from '../../../../../services/staff';

const ChangeTable = () =>{ 
    const {setOpenChangeTable,billment,setOpenMenu} = useContext(Context)
    const [tables,setTables]= useState([])
    const [messageBox,setMessagBox] = useState({open:false,message:"",type:""})
    useEffect(()=>{ 
        fetch()
    },[])
    const fetch = async () =>{ 
        let {data:tables} = await TableService.listByCounter()
        tables.forEach((table)=>{
            table.selected = false
        })
        setTables(tables.filter(table=> table.fields.status == 0))
    }
    const handleChange = (table) =>{ 
        let _tables = tables
        _tables.forEach(t=>{ 
            if(table.pk == t.pk){
                t.selected = !t.selected
            }
            if(table.pk !== t.pk){
                t.selected = false
            }
        })
        
        setTables([...tables])
    }
    const handleCloseMessageBox =() =>{
        setMessagBox({...messageBox,open:false})
    }
    const handleChangeTable = async () => {
        const {pk:table_id_new} = tables.filter(table => table.selected)[0]
        StaffService.changeTable({table_id_old:Number(billment.tableId),table_id_new}).then((result)=>{
            setOpenChangeTable(false)
            setOpenMenu(false)
        }).catch(err=>{
            const {mess} = JSON.parse(err.request.response)
            setMessagBox({open:false,message:mess,type:"error"})
        })
    }
    return ( 
        <Fragment>
            <Dialog maxWidth="sm" fullWidth  open={true}>
                <DialogContent>
                    <div style={{textAlign:'center'}}>
                        <h2>Đổi bàn</h2>
                    </div>
                    <ul style={{listStyleType:"none"}}>
                        {tables.map((table,index)=>(
                            <li key={index}><Checkbox disabled={billment.tableId == table.pk} onChange={()=>handleChange(table)} color="primary" checked={table.selected} />{table.fields.name}</li>
                        ))}
                    </ul>
                </DialogContent>
                <DialogActions>
                    <Button style={{color:"white",backgroundColor:"#ffc107"}} onClick={()=>setOpenChangeTable(false)}>Hủy</Button>
                    <Button style={{color:"white",backgroundColor:"#444444"}} onClick={()=>handleChangeTable()}>Xác nhận</Button>
                </DialogActions>
            </Dialog>
            <CustomAlert type={messageBox.type} closeMessage={handleCloseMessageBox} message={messageBox.message} open={messageBox.open} />      
        </Fragment>
    )
}

export default React.memo(ChangeTable)