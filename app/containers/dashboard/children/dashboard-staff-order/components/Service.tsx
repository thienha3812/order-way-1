import React, {
    Fragment,
    useContext,
    useEffect,
    useState,
    useRef,
  } from "react";

  import { FaTrash } from 'react-icons/fa';
  import { GrAdd } from "react-icons/gr";
  import {
    Dialog,
    DialogContent,
    IconButton,
    TextField,
    Grid,
    Button,
    DialogActions,
  } from "@material-ui/core";
  import Tabs from "@material-ui/core/Tabs";
  import Tab from "@material-ui/core/Tab";
  import Typography from "@material-ui/core/Typography";
  import Box from "@material-ui/core/Box";
  import Paper from "@material-ui/core/Paper";
  import { Context } from "../Context";
  import { caculateAllValue, convertToVnd } from "../../../../../utils";
  import CustomAlert from "../../../../../components/Alert";
import StaffService from "../../../../../services/staff";
  
  function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  const Service = () => {
    const [openModal, setOpenModal] = useState(false);
    const [serviceForm, setServiceForm] = useState({ name: "", price: 0,type:"service" });
    const [surchargeForm, setSurchargeForm] = useState({ name: "", price: 0,type:"surcharge" });
    const [messageBox, setMessagBox] = useState({
      open: false,
      message: "",
      type: "",
    });
    const [value, setValue] = React.useState(0);
    const { billment, setBillMent } = useContext(Context);
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    const handleServiceForm = (event, key) => {
      setServiceForm({ ...serviceForm, [key]: event.target.value });
    };
    const handleCloseMessageBox = () => {
      setMessagBox({ ...messageBox,open: false});
    };
    const addServiceToOrder = () => {
      const regex = /^[0-9]*$/g;
      if (serviceForm.price == 0) {
        setMessagBox({
          message: "Giá không hợp lệ",
          open: true,
          type: "warning",
        });
        return;
      }
      if (!regex.test(serviceForm.price)) {
        setMessagBox({
          message: "Giá không hợp lệ",
          open: true,
          type: "warning",
        });
        return;
      }
      let service = billment.payment_info.service;
      service.push({...serviceForm,new:true,index:billment.payment_info?.service?.length});
      setBillMent({
        ...billment,
        payment_info: { ...billment.payment_info, service },
      });
    };
    const confirmUpdateOrder =() =>{ 
        let payment_info = billment.payment_info
        let sub_total = Number(payment_info?.sub_total) + payment_info?.service?.filter(s => s.new === true).reduce((a,b)=> a + Number(b.price),0)
        let total = sub_total - caculateAllValue({payment_info : {...payment_info,sub_total : sub_total},pmts : billment.pmts})
        let discount_amount = caculateAllValue({payment_info : {...payment_info,sub_total : sub_total},pmts : billment.pmts})
        StaffService.updatStoreOrderInfo({
            address: payment_info?.address,
            bill_number:payment_info?.bill_number,
            bill_sequence:payment_info?.bill_sequence,
            cash: sub_total,
            content_discount: payment_info?.content_discount,
            credit:payment_info?.credit,
            cus_order_id:payment_info?.cus_order_id,
            customer_id:payment_info?.customer_id,
            customer_name:payment_info?.customer_name,
            discount_amount,
            e_money:payment_info?.e_money,
            foods:payment_info.foods,
            id:payment_info?.id,
            is_payment:payment_info?.is_payment,
            phone_number:payment_info?.phone_number,
            promotionId: billment.pmts,
            service:payment_info?.service?.map(s => ({type : s.type,name:s.name,price:s.price})),
            store_id:payment_info?.store_id,
            store_name:payment_info?.store_name,
            sub_total: sub_total,
            table_id:payment_info?.table_id,
            table_name: payment_info.table_name,
            time_in:payment_info?.time_in,
            total:total,
            vat_percent:payment_info?.vat_percent,
            vat_value:payment_info?.vat_value
          }).then(async(result)=>{
              setOpenModal(false)
              const {payment_info,pmts} = await StaffService.getPaymentInfo(billment.tableId)
              setBillMent({...billment,payment_info,pmts})
              setMessagBox({type:"success",open:true,message:"Cập nhật thành công"})
          }).catch(err=>{
            setMessagBox({type:"warning",open:true,message:"Lỗi"})
          })
    }
    const handleSurchargeForm = (event, key) => {
      setSurchargeForm({ ...surchargeForm, [key]: event.target.value });
    };
    const addSurchargeToOrder = () => {
      const regex = /^[0-9]*$/g;
      if (surchargeForm.price == 0) {
        setMessagBox({
          message: "Giá không hợp lệ",
          open: true,
          type: "warning",
        });
        return;
      }
      if (!regex.test(surchargeForm.price)) {
        setMessagBox({
          message: "Giá không hợp lệ",
          open: true,
          type: "warning",
        });
        return;
      }
      let service = billment.payment_info.service;
      service.push({...surchargeForm,new : true});
      setBillMent({
        ...billment,
        payment_info: { ...billment.payment_info, service },
      });
    };
    const removeService = (service,index) => {
        let payment_info = billment.payment_info  
        let _service = billment.payment_info?.service
        let sub_total = billment.payment_info?.sub_total - service.price
        let total =  sub_total -  caculateAllValue({payment_info : {...payment_info,sub_total : sub_total},pmts : billment.pmts})
        delete _service[index]
        if(service.new !== true){
          StaffService.updatStoreOrderInfo({
            address: payment_info?.address,
            bill_number:payment_info?.bill_number,
            bill_sequence:payment_info?.bill_sequence,
            cash: sub_total,
            content_discount: payment_info?.content_discount,
            credit:payment_info?.credit,
            cus_order_id:payment_info?.cus_order_id,
            customer_id:payment_info?.customer_id,
            customer_name:payment_info?.customer_name,
            discount_amount:payment_info?.discount_amount,
            e_money:payment_info?.e_money,
            foods:payment_info.foods,
            id:payment_info?.id,
            is_payment:payment_info?.is_payment,
            phone_number:payment_info?.phone_number,
            promotionId: billment.pmts,
            service:_service.filter(Boolean),
            store_id:payment_info?.store_id,
            store_name:payment_info?.store_name,
            sub_total: sub_total,
            table_id:payment_info?.table_id,
            table_name: payment_info.table_name,
            time_in:payment_info?.time_in,
            total:total,
            vat_percent:payment_info?.vat_percent,
            vat_value:payment_info?.vat_value
          }).then(async(result)=>{
              const {payment_info,pmts} = await StaffService.getPaymentInfo(billment.tableId)
              setBillMent({...billment,payment_info,pmts})
              setMessagBox({type:"success",open:true,message:"Cập nhật thành công"})
          }).catch(err=>{
            setMessagBox({type:"warning",open:true,message:"Lỗi"})
          })
        }
        setBillMent({...billment,payment_info:{...billment.payment_info,service:_service}})
    }
    const handleCloseModel = () =>{
        setBillMent({...billment,payment_info:{...billment.payment_info,service:billment.payment_info?.service.filter(s => s.new !== true)}})
        setOpenModal(false)
    }
    return (
      <Fragment>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <b>Phí dịch vụ/phụ thu:</b>
          </div>
          <IconButton
            onClick={() => setOpenModal(true)}
            style={{ color: "black", borderRadius: 0 }}
          >
            <GrAdd />
          </IconButton>
  
          <Dialog BackdropProps={{
                style:{
                    backgroundColor:"transparent"
                }
                }} 
                open={openModal}>
            <DialogContent>
              <Paper square style={{boxShadow:"none"}}>
                <Grid container justify="center" >
                    <Grid item xs={8}>
                    <Tabs
                  value={value}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={handleChange}
                  aria-label="disabled tabs example"
                >
                  <Tab label="Phí dịch vụ" />
                  <Tab label="Phụ thu" />
                </Tabs>
                    </Grid>

                </Grid>
              </Paper>
              <TabPanel value={value} index={0}>
                <Grid container>
                  <Grid item xs={12}>
                    <TextField
                      onChange={(event) => handleServiceForm(event, "name")}
                      style={{ width: "100%" }}
                      variant="outlined"
                      label="Tên dịch vụ"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type="number"
                      onChange={(event) => handleServiceForm(event, "price")}
                      style={{ width: "100%", marginTop: "10px" }}
                      variant="outlined"
                      label="Giá dịch vụ"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      onClick={addServiceToOrder}
                      style={{height: "60px",backgroundColor:"#444444",color:"#fff", marginTop: "10px" }}
                      variant="contained"
                    >
                      Thêm
                    </Button>
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Grid container>
                  <Grid item xs={12}>
                    <TextField
                      onChange={(event) => handleSurchargeForm(event, "name")}
                      style={{ width: "100%" }}
                      variant="outlined"
                      label="Tên phụ thu"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      onChange={(event) => handleSurchargeForm(event, "price")}
                      style={{ width: "100%", marginTop: "10px" }}
                      variant="outlined"
                      label="Số tiền phụ thu"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      onClick={addSurchargeToOrder}
                      style={{ height: "60px",backgroundColor:"#444444",color:"#fff", marginTop: "10px" }}
                      variant="contained"
                    >
                      Thêm
                    </Button>
                  </Grid>
                </Grid>
              </TabPanel>
              <Grid container>
                <Grid item xs={12} style={{ textAlign: "center" }}>
                  <b> Phí dịch vụ/phụ thu đang áp dụng </b>
                </Grid>
                <Grid item xs={12}>
                    <ul>
                        {billment.payment_info?.service.map((s, index) => (
                            <li>
                                {s.type === "service"
                                ? "Loại: dịch vụ"
                                : "Loại: phụ thu "}
                                {",Tên: " + s.name}
                                {",Giá: " + convertToVnd(s.price)}
                                <FaTrash onClick={()=>removeService(s,index)} fontSize={15} style={{marginLeft:"5px"}}/>
                            </li>
                            ))}
                      </ul>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => handleCloseModel()}
                style={{color:"white",backgroundColor:"#ffc107"}}
              >
                Hủy 
              </Button>
              <Button style={{color:'white',backgroundColor:"#444444"}} onClick={confirmUpdateOrder} variant="outlined">
                Xác nhận
              </Button>
            </DialogActions>
          </Dialog>
          <CustomAlert
            type={messageBox.type}
            closeMessage={handleCloseMessageBox}
            message={messageBox.message}
            open={messageBox.open}
          />
        </div>
      </Fragment>
    );
  };
  
  export default Service;
  