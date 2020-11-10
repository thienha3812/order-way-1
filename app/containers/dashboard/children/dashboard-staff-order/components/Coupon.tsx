import React, { Fragment, useContext, useEffect, useState,useRef } from "react";

import { IoMdQrScanner } from "react-icons/io";
import { GrAdd } from "react-icons/gr";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  TextField,
  IconButton,
  DialogActions,
} from "@material-ui/core";
import { Context } from "../Context";
import QrReader from "react-qr-reader";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { FiUser } from "react-icons/fi";
import { GrRestaurant } from "react-icons/gr";
import PromotionService from "../../../../../services/promotion";
import CustomAlert from "../../../../../components/Alert";
import ConfigService from "../../../../../services/config";
import { MdAdd } from "react-icons/md";
import { RiSubtractLine } from "react-icons/ri";
import StaffService from "../../../../../services/staff";
import { current } from "@reduxjs/toolkit";

const TabPanel = (props) => {
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
};


const Coupon = () => {
  const {
    openScanCoupon,
    setOpenScanCoupon,
    openTypeCoupon,
    setOpenTypeCoupon,
    billment,
    setBillMent,
  } = useContext(Context);
  const [couponInput, setCouponInput] = useState("");
  const [value, setValue] = React.useState(0);
  const [promotionOfStore, setPromotionOfStore] = useState([]);
  const [config, setConfig] = useState([]);
  const [messageBox, setMessageBox] = useState({
    open: false,
    message: "",
    type: "",
  });
  
  
  useEffect(()=>{
    if(openTypeCoupon === true){
      fetch()
    }
  },[openTypeCoupon])
  useEffect(() => {
    fetch();
  }, []);   
  const getQuantityPmt = () => {
    return config.filter((c) => c.fields.code === "quantity_pmt")[0].fields
      .value;
  };
  const allowAddMore = (promotion) : boolean => { 
    let allow =  false 
    switch(promotion.type){
      case "discount_with_max_value":
        const allowQuantityDiscountWithMaxValue = config.filter(c=> c.fields.code === "quantity_discount")[0].fields.value
        let quantityDiscountWithMaxValue = billment.pmts?.filter((p)=> p.type == "discount").reduce((a,b)=> a + b.quantity_apply,0)
        if(allowQuantityDiscountWithMaxValue == 2){
          allow = true
        }
        if(allowQuantityDiscountWithMaxValue == 1 && quantityDiscountWithMaxValue < 1){
            allow = true
        }
        break
      case "discount":
        const allowQuantityDiscount = config.filter(c=> c.fields.code === "quantity_discount")[0].fields.value
        let quantityDiscount = billment.pmts?.filter((p)=> p.type == "discount").reduce((a,b)=> a + b.quantity_apply,0)
        if(allowQuantityDiscount == 2){
          allow = true
        }
        if(allowQuantityDiscount == 1 && quantityDiscount < 1){
            allow = true
        }
        break
      case "free_item":
        const allowQuantityFreeItem = config.filter(c=> c.fields.code === "quantity_free_item")[0].fields.value
        let quantityFreeItem = billment.pmts?.filter((p)=> p.type == "free_item").reduce((a,b)=> a + b.quantity_apply,0)
        if(allowQuantityFreeItem == 2){
            allow = true
        }
        if(allowQuantityFreeItem == 1 && quantityFreeItem < 1){
            allow = true
        }
        break  
      case "voucher":
        const allowQuantityVoucher = config.filter(c=> c.fields.code === "quantity_voucher")[0].fields.value
        let quantityVoucher = billment.pmts?.filter((p)=> p.type == "free_item").reduce((a,b)=> a + b.quantity_apply,0)
        if(allowQuantityVoucher == 2){
          allow = true
        }
        if(allowQuantityVoucher == 1 && quantityVoucher < 1){
            allow = true
        }
        break         
    }
    return allow
  }
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  const fetch = async () => {
    const { data: config } = await ConfigService.getConfig();
    setConfig(config);
    const { data: promotions } = await PromotionService.getPromotionByStore();
    mapApplyQuantityFromPmtToPromotionStore(promotions);
  };
  const mapApplyQuantityFromPmtToPromotionStore = (promotions: []) => {
    let pmts = billment.pmts;
    promotions.forEach((promotion) => {
      promotion.quantity_apply = 0;
      pmts?.forEach((pmt) => {
        if (pmt.id === promotion.id) {
          promotion.quantity_apply = pmt.quantity_apply;
        }
      });
    });
    setPromotionOfStore(promotions);
  };
  const mapApplyQuantityFromPromotionStoretToPmt = (promotion,type) => {
    let _pmts = billment.pmts;
    let index = _pmts?.findIndex((_p) => _p.id === promotion.id);
    if(type==="add"){
      if (Number(index) > -1) {
        _pmts?.forEach((_pmt) => {
          if (_pmt.id === promotion.id) {
            _pmt.quantity_apply += 1;
          }
        });
        setBillMent({ ...billment, pmts: _pmts });
      } else {
        _pmts.push({ ...promotion, quantity_apply: 1 });
        setBillMent({ ...billment, pmts: _pmts });
      }
    }
    if(type==="sub"){
      _pmts?.forEach((_pmt) => {
        if (_pmt.id === promotion.id) {
          _pmt.quantity_apply -= 1;
        }
      });
      setBillMent({ ...billment, pmts: _pmts.filter(_p => _p.quantity_apply !== 0) });
    }
  };
  const formatID = (id:string) =>{
    let len = 6 - id.length            
    return new Array(len).fill("0").join("").concat(id)
  }
  const handleScan = (data:string) => {
    if (data) {
      let texts = data.split("-")
      PromotionService.checkPmt({ pmt_id: formatID(texts[0]), totalPrice: 11200 })
        .then((result) => {
          mapApplyQuantityFromPromotionStoretToPmt(result.data,"add")
        })
        .catch(() => {
        });
      setOpenScanCoupon(false);
    }
  };
  const handleCloseMessageBox = () => {
    setMessageBox({
      open: false,
      message: messageBox.message,
      type: messageBox.type,
    });
  };
  const handleError = () => {};

  const updatePromotionStore = (promotion, type) => {
    if (type === "add") {
      let quantity_pmt = getQuantityPmt();
      if (Number(quantity_pmt) === 1) {
        for(let p of billment.pmts){
          if(p.quantity_apply == 1){
            setMessageBox({
              open: true,
              message:"Bạn chỉ áp dụng được duy nhất một mã khuyến mãi trên đơn hàng này",
              type: "warning",
            });
            return 
          }
        }
      }
      const allow = allowAddMore(promotion)
      if(!allow){
        setMessageBox({
          open: true,
          message:"Bạn chỉ áp dụng được duy nhất một mã khuyến mãi trên đơn hàng này",
          type: "warning",
        });
        return
      }
      let _promotionStore = promotionOfStore;
      _promotionStore.forEach((p) => {
        if (p.id === promotion.id) {
          p.quantity_apply += 1;
        }
      });
      mapApplyQuantityFromPromotionStoretToPmt(promotion,"add");
      setPromotionOfStore([..._promotionStore]);
      setBillMent({...billment,payment_info:{...billment.payment_info}})
    }
    if (type === "sub") {
      if(promotion.quantity_apply === 0){
        return
      }
      let _promotionStore = promotionOfStore;
      _promotionStore.forEach((p) => {
        if (p.id === promotion.id) {
          p.quantity_apply -= 1;
        }
      });      
      mapApplyQuantityFromPromotionStoretToPmt(promotion,"sub");
      setPromotionOfStore([..._promotionStore]);
      setBillMent({...billment,payment_info:{...billment.payment_info}})
    }
  };
  const confirmCoupon = () => {
    let quantity_pmt = getQuantityPmt();
    PromotionService.checkPmt({ pmt_id: couponInput, totalPrice: 11200 })
      .then((result) => {
        if (Number(quantity_pmt) === 2) {
          updatePromotionStore({...result.data,code:couponInput},"add");
        } 
        else {
          if (billment.pmts?.filter(p=> p.quantity_apply !==0).length == 0) {
            updatePromotionStore({...result.data,code:couponInput},"add");
          } else {
            setMessageBox({
              open: true,
              message:
                "Bạn chỉ áp dụng được duy nhất một mã khuyến mãi trên đơn hàng này",
              type: "warning",
            });
          }
        }
      })
      .catch(() => {
        setMessageBox({
          type: "warning",
          open: true,
          message: "Mã khuyến mãi không hợp lệ!",
        });
      });
  };
  const caculateValueDiscount = () =>{
    let value = 0
    let pmts = billment.pmts?.filter(p=> p.quantity_apply !== 0)
    if(pmts?.length > 0){
        pmts?.forEach(p=>{
          if(p.discount_percent > 0 && p.type === "discount"){
            value += Number.parseFloat(p.discount_percent*p.quantity_apply)
          }
        })
    }
    return value
  }
  const caculateValueFreeItem = () =>{
    let value = 0 
    let pmts = billment.pmts?.filter(p=> p.quantity_apply !== 0 && p.type === "free_item")
    pmts?.forEach((p)=>{
      const current_apply = p.quantity_apply
      const sortFollowAmount = billment.payment_info.foods?.filter(f=> f.foodId == p.item_free).sort((a,b)=> a.price < b.price)
      let applied = 0
      if(sortFollowAmount?.length > 0){
        sortFollowAmount.forEach((food)=>{
          value += Math.min(current_apply - applied,food.quantity) * food.price
          applied += Math.min(current_apply - applied,food.quantity)
        })
      }
    })
    return value
  }
  const caculateMaxValueVoucher = () => {
    let value = 0
    let pmts = billment.pmts?.filter(p=> p.quantity_apply !== 0 && p.type === "discount_with_max_value")
    pmts?.forEach(p=>{
      if(billment.payment_info?.sub_total >= p.discount_on_amount){
          let discountOnPercent = (p.discount_percent/100) * billment.payment_info?.sub_total 
          value += Math.min(discountOnPercent,p.max_discount) * p.quantity_apply
      }
    })
    return value 
  }
  const caculateValueVoucher = () =>{
    let sum = 0
    let pmts = billment.pmts?.filter(p=> p.quantity_apply !== 0)
    if(pmts?.length > 0){
        pmts?.forEach(p=>{
          if(p.value_of_voucher > 0 &&  p.type=== "voucher"){
            sum += Number.parseFloat(p.value_of_voucher * p.quantity_apply)
          }
        })
    }
    return sum
  }
  const applyPromotion = async () =>{    
    const discount_percent = caculateValueDiscount()
    const valueVoucher = caculateValueVoucher()
    const valueFreeItem = caculateValueFreeItem()
    const valueWithMaxValue = caculateMaxValueVoucher()
    const payment_info = billment.payment_info
    StaffService.updatStoreOrderInfo({
      address: payment_info?.address,
      bill_number:payment_info?.bill_number,
      bill_sequence:payment_info?.bill_sequence,
      cash: Math.max(0,payment_info?.sub_total - valueVoucher - (payment_info?.sub_total * (discount_percent/100)) -valueFreeItem - valueWithMaxValue),
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
      promotionId:billment.pmts?.filter(p=> p.quantity_apply !== 0),
      service:payment_info?.service,
      store_id:payment_info?.store_id,
      store_name:payment_info?.store_name,
      sub_total:payment_info?.sub_total,
      table_id:payment_info?.table_id,
      table_name: payment_info.table_name,
      time_in:payment_info?.time_in,
      total:Math.max(0,payment_info?.sub_total - valueVoucher - (payment_info?.sub_total * (discount_percent/100)) - valueFreeItem - valueWithMaxValue),
      vat_percent:payment_info?.vat_percent,
      vat_value:payment_info?.vat_value
    }).then(async()=>{
      const {payment_info : new_payment_info,pmts} = await StaffService.getPaymentInfo(billment.tableId)
      setBillMent({...billment,pmts,payment_info:new_payment_info})
      setOpenTypeCoupon(false)
      setMessageBox({message:"Sử dụng mã khuyến mãi thành công",open:true,type:"success"})
    }).catch(err=>{
      setMessageBox({message:"Đã xảy ra lỗi!",open:true,type:"warning"})
    })
    
  }
  const handleCloseTypeCoupon =  async () =>{
    try{
      setOpenTypeCoupon(false)  
      const {pmts} = await StaffService.getPaymentInfo(billment.tableId)
      if(!pmts || pmts.length === 0){
        setBillMent({...billment,pmts:[]})
      }else{
        setBillMent({...billment,pmts,payment_info:{...billment.payment_info}})
      }
    }catch(err){
      setOpenTypeCoupon(false)  
    }
  }

  return (
    <Fragment>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div><b>Khuyến mãi: </b></div>
        <IconButton
          onClick={() => setOpenScanCoupon(!openScanCoupon)}
          style={{ color: "black", borderRadius: 0 }}
        >
          <IoMdQrScanner />
        </IconButton>
        <IconButton
          onClick={() => setOpenTypeCoupon(!openTypeCoupon)}
          style={{ color: "black", borderRadius: 0 }}
        >
          <GrAdd />
        </IconButton>
      </div>
      {openScanCoupon && (
        <div>
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              height: "400px",
              width: "400px",
            }}
          />
        </div>
      )}
      <Dialog
        open={openTypeCoupon}
        onClose={() => setOpenTypeCoupon(false)}
        fullWidth
        BackdropProps={{
          style:{
            backgroundColor:"transparent"
          }
        }}
        maxWidth="sm"
      >
        <DialogTitle>Áp dụng khuyến mãi</DialogTitle>
        <DialogContent>
          <Paper square>
            <Tabs value={value} onChange={handleChangeTab}>
              <Tab label="Khách hàng" icon={<FiUser />} />
              <Tab label="Nhà hàng" icon={<GrRestaurant />} />
            </Tabs>
          </Paper>
          <TabPanel value={value} index={0}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={8} style={{ height: "80px" }}>
                <TextField
                  onChange={(event) => setCouponInput(event.target.value)}
                  style={{ width: "100%" }}
                  placeholder="Nhập mã khuyến mãi"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={4} style={{ height: "80px" }}>
                <Button
                  color="secondary"
                  onClick={confirmCoupon}
                  variant="outlined"
                  style={{ height: "100%" }}
                >
                  Xác nhận
                </Button>
              </Grid>
            </Grid>
            <div style={{ marginTop: "20px" }}> </div>
            <Divider />
            <h5>Đang áp dụng </h5>
            <Grid container>
                <ul>
                    {billment.pmts.filter(p=>p.quantity_apply !==0).map((p=>(
                      <li>{p.quantity_apply} x {p.name}</li>
                    )))}
                </ul>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Grid container>
              {promotionOfStore.map((promotion, index) => (
                <Grid
                  key={index}
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  <IconButton
                    onClick={() => updatePromotionStore(promotion, "add")}
                    size="small"
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      height: "30px",
                      borderRadius: "0",
                    }}
                    disableFocusRipple
                    disableRipple
                  >
                    <MdAdd fontSize={25} />
                  </IconButton>
                  <div style={{ color: "red", marginLeft: "5px" }}>
                    {promotion.quantity_apply || 0}
                  </div>
                  <IconButton
                    size="small"
                    onClick={() => updatePromotionStore(promotion, "sub")}
                    style={{
                      backgroundColor: "#e0e0e0",
                      marginLeft: "5px",
                      color: "white",
                      height: "30px",
                      borderRadius: "0",
                    }}
                    disableFocusRipple
                    disableRipple
                  >
                    <RiSubtractLine fontSize={25} />
                  </IconButton>
                  <div style={{ marginLeft: "5px" }}>{promotion.name}</div>
                </Grid>
              ))}
            </Grid>
            <h5>Đang áp dụng </h5>
            <Grid container>
                <ul>
                  {billment.pmts.filter(p=>p.quantity_apply !==0).map((p=>(
                      <li>{p.quantity_apply} x {p.name}</li>
                    )))}
                </ul>
            </Grid>
          </TabPanel>
          <DialogActions>
            <Button onClick={handleCloseTypeCoupon}>Hủy</Button>
            <Button onClick={applyPromotion}>Xác nhận</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <CustomAlert
        type={messageBox.type}
        closeMessage={handleCloseMessageBox}
        message={messageBox.message}
        open={messageBox.open}
      />
    </Fragment>
  );
};

export default React.memo(Coupon);
