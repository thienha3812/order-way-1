import { Grid,Dialog,makeStyles,MenuItem,FormControl,Select,InputLabel, Button, DialogContent, DialogActions } from '@material-ui/core'
import React, { useEffect, useState } from  'react'
import styled from 'styled-components'
import MoneyBoxService from '../../../../services/money-box';
import StaffService from '../../../../services/staff';
import Table from './components/table';
import Pagination from '../../../../components/Pagination'
import { useHistory } from 'react-router';
const Wrapper = styled.div`
  padding: 5%;
  margin-top:40px;
  border:1px solid #3333;
  border-radius:15px;
  font-size:16px;
`;
const useStyles = makeStyles(()=>({
    root : {
        width:"100%"
    }
}))

const MoneyBoxHistory = () =>{ 
    const styles = useStyles()
    const  [staffs,setStaffs] = useState([])
    const history  = useHistory()
    const [tableData,setTableData] = useState([])
    const [rows,setRows] = useState(0)
    const [formSearch,setFormSearch] = useState({limit:10,type:"",offset:0,staff:null,moneyType:null})
    const typeTransaction  = [
        {
            label: 'Tất cả',
            value: null
        },
        {
            label: 'Thu',
            value: 'plus'
        },
        {
            label: 'Chi',
            value: 'minus'
        },
        {
            label: 'Vốn đầu ngày',
            value: 'fund'
        }
    ]
    const typeMoney  = [
        {
            label: 'Tất cả',
            value: null
        },
        {
            label: 'Tiền mặt',
            value: 'cash'
        },
        {
            label: 'Chuyển khoản',
            value: 'credit'
        },
        {
            label: 'Tiền điện tử',
            value: 'e_money'
        }
    ]
    const fetchStaffs = async () =>{ 
        const {data} = await StaffService.staffOption()
        setStaffs([{text:'Tất cả',value:null},...data])
    }
    const handleSearch = async () =>{
        const {data} = await MoneyBoxService.search(formSearch)
        setRows(data.total_row)
        setTableData(data.data)
    }
    const handleSelectPage =  async (index) =>{ 
        const {data} = await MoneyBoxService.search({...formSearch,offset:(index-1)*10})
        setRows(data.total_row)
        setTableData(data.data)
    }
    useEffect(()=>{
        fetchStaffs()
    },[])
    return ( 
        <Wrapper>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <FormControl className={styles.root} style={{marginTop:"10px"}}>
                        <InputLabel id="demo-simple-select-label">Loại giao dịch</InputLabel>
                        <Select
                            variant="outlined"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formSearch.type || null}
                            onChange={(event)=> setFormSearch({...formSearch,type:event.target.value})}
                        >
                            {typeTransaction.map(f => (
                                <MenuItem value={f.value}>{f.label}</MenuItem>                            
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl className={styles.root} style={{marginTop:"10px"}}>
                        <InputLabel id="demo-simple-select-label">Loại tiền </InputLabel>
                        <Select
                            variant="outlined"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formSearch.moneyType || null}
                            onChange={(event)=> setFormSearch({...formSearch,moneyType:event.target.value})}
                        >
                            {typeMoney.map(f => (
                                <MenuItem value={f.value}>{f.label}</MenuItem>                            
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl className={styles.root} style={{marginTop:"10px"}}>
                        <InputLabel id="demo-simple-select-label">Nhân viên </InputLabel>
                        <Select
                            variant="outlined"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formSearch.staff || null}
                            onChange={(event)=> setFormSearch({...formSearch,staff:event.target.value})}
                        >
                            {staffs.map(f => (
                                <MenuItem value={f.value}>{f.text}</MenuItem>                            
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid item xs={12} style={{marginTop:"10px"}}>
                <div style={{display:'flex',flexDirection:"column"}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                        <div>
                            <Button  onClick={()=>history.goBack()} style={{backgroundColor:"#444444",color:"white"}}>Quay lại</Button>
                        </div>
                        <div>
                            <Button onClick={handleSearch} style={{backgroundColor:"#444444",color:"white"}}>Tìm kiếm</Button>
                        </div>
                    </div>
                    <div>
                        Số kết quả: {rows}
                    </div>
                </div>
            </Grid>
            <Grid style={{marginTop:"10px"}} item xs={12}>
                <Table data={tableData} />
            </Grid>
            <Grid container justify="center" style={{marginTop:"10px"}}>
                <Grid item xs={6} >
                    {rows > 0 && (
                        <Pagination pageCount={Math.ceil(rows/10)} onSelect={handleSelectPage} />
                    )}
                </Grid>
            </Grid>
           
        </Wrapper>
    )   
}

export default MoneyBoxHistory