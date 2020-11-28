import React, { Fragment, useContext, useEffect, useState } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Context } from '../Context';
import TableService from '../../../../../services/tables';
import { Checkbox, DialogActions,Button } from '@material-ui/core';
import StaffService from '../../../../../services/staff';
import CustomAlert from '../../../../../components/Alert';

const MergeTable = () =>{ 
    const {setOpenMergeTable,billment,setBillMent} = useContext(Context)
    const [tables,setTables]= useState<any[]>([])
    const [messageBox,setMessagBox] = useState({open:false,message:"",type:""})
    useEffect(()=>{ 
        fetch()
    },[])
    const fetch = async () =>{ 
        let {data} = await TableService.listByCounter()
        data.forEach((table)=>{
            table.selected = false
        })
        setTables(data.filter(table=> table.pk != billment.tableId))
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
    const handleMergeTable = async  () =>{ 
        let tablesID  : Array<number> = tables.filter(table=> table.selected === true).map(table=> table.pk)
        StaffService.mergeTable({table_id : Number(billment.tableId),merge_with:tablesID}).then(async()=>{
            setMessagBox({open:true,message:"Gộp bàn thành công!",type:"success"})            
            setTimeout(()=>{
                setOpenMergeTable(false)
            },500)
            const {payment_info} = await StaffService.getPaymentInfo(billment.tableId)
            setBillMent({...billment,payment_info})
        }).catch(err=>{
            const {mess} = JSON.parse(err.request.response)
            setMessagBox({open:false,message:mess,type:"error"})
        })
    }
    const handleCloseMessageBox =() =>{
        setMessagBox({...messageBox,open:false})
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
                            <li key={index}><Checkbox onChange={()=>handleChange(table)} color="primary" checked={table.selected} />{table.fields.name}</li>
                        ))}
                    </ul>
                </DialogContent>
                <DialogActions>
                    <Button style={{color:"white",backgroundColor:"#ffc107"}} onClick={()=>setOpenMergeTable(false)}>Hủy</Button>
                    <Button style={{color:"white",backgroundColor:"#444444"}} onClick={()=>handleMergeTable()}>Xác nhận</Button>
                </DialogActions>
            </Dialog>
            <CustomAlert type={messageBox.type} closeMessage={handleCloseMessageBox} message={messageBox.message} open={messageBox.open} />      
        </Fragment>
    )
}

export default React.memo(MergeTable)