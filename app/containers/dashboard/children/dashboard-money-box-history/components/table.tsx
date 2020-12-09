import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


const BasicTable = ({data})  =>{
  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><b>STT</b></TableCell>
            <TableCell ><b>Loại</b></TableCell>
            <TableCell ><b>Số tiền</b></TableCell>
            <TableCell ><b>Nội dung</b></TableCell>
            <TableCell ><b>Tiền mặt</b></TableCell>
            <TableCell ><b>Chuyển khoản</b></TableCell>
            <TableCell ><b>Thời gian</b></TableCell>
            <TableCell ><b>Nhân viên</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {data.map((row)=> ( 
                <TableRow key={row.stt}>
                <TableCell component="th" scope="row">
                  {row.stt}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.type === "minus" && "Chi"}
                  {row.type === "fund" && "Vốn đầu ngày"}
                  {row.type === "plus" && "Thu"}
                </TableCell>
                <TableCell >{row.total}</TableCell>
                <TableCell >{row.content}</TableCell>
                <TableCell >{row.cash}</TableCell>
                <TableCell >{row.credit}</TableCell>
                <TableCell >{row.created_at}</TableCell>
                <TableCell >{row.created_by}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default BasicTable