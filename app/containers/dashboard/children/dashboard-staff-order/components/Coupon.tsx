import React, { Fragment, useContext, useEffect, useState } from "react";

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

  const fetch = async () => {
    const { data: config } = await ConfigService.getConfig();
    setConfig(config);
    const { data: promotions } = await PromotionService.getPromotionByStore();
    mapApplyQuantityFromPmtToPromotionStore(promotions);
  };
  useEffect(() => {
    fetch();
  }, []);  
  const getQuantityPmt = () => {
    return config.filter((c) => c.fields.code === "quantity_pmt")[0].fields
      .value;
  };
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
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
  const handleScan = (data) => {
    if (data) {
      PromotionService.checkPmt({ pmt_id: "00000046", totalPrice: 11200 })
        .then((result) => {
          mapApplyQuantityFromPromotionStoretToPmt(result.data,"add")
        })
        .catch(() => {});
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
  const increaseOrAddPmt = (pmt) => {
    let _pmts = billment.pmts;
    const index = _pmts?.findIndex((p) => p.id === pmt.id);
    if (index > -1) {
      _pmts?.forEach((_pmt) => {
        if (_pmt.id === pmt.id) {
          _pmt.quantity_apply += 1;
        }
      });
      setBillMent({ ...billment, pmts: _pmts });
    } else {
      _pmts.push({ ...pmt, quantity_apply: 1 });
      setBillMent({ ...billment, pmts: _pmts });
    }
  };
  const updatePromotionStore = (promotion, type) => {
    console.log(123)
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
      let _promotionStore = promotionOfStore;
      _promotionStore.forEach((p) => {
        if (p.id === promotion.id) {
          p.quantity_apply += 1;
        }
      });
      mapApplyQuantityFromPromotionStoretToPmt(promotion,"add");
      setPromotionOfStore([..._promotionStore]);
      setBillMent({...billment,payment_info:{...billment.payment_info,rate_discount: billment.payment_info?.rate_discount + Number.parseInt(promotion.discount_percent)}})
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
      setBillMent({...billment,payment_info:{...billment.payment_info,rate_discount: billment.payment_info?.rate_discount -  Number.parseInt(promotion.discount_percent)}})
    }
  };
  const confirmCoupon = () => {
    let quantity_pmt = getQuantityPmt();
    PromotionService.checkPmt({ pmt_id: couponInput, totalPrice: 11200 })
      .then((result) => {
        if (Number(quantity_pmt) === 2) {
          increaseOrAddPmt(result.data);
        } else {
          if (billment.pmts?.length == 0) {
            console.log(result.data);
            increaseOrAddPmt(result.data);
          } else {
            setMessageBox({
              open: true,
              message:
                "Bạn chỉ áp dụng được duy nhất một mã khuyến mãi trên đơn hàng này",
              type: "warning",
            });
          }
        }

        setOpenTypeCoupon(false);
      })
      .catch(() => {
        setMessageBox({
          type: "warning",
          open: true,
          message: "Mã khuyến mãi không hợp lệ!",
        });
      });
  };
  const applyPromotion = () =>{
    setOpenTypeCoupon(false)

  }
  const handleCloseTypeCoupon =  async () =>{
      // let _p = promotionOfStore
      // _p.forEach(_p=>{
      //   _p.quantity_apply = 0
      // })
      // const {pmts} = await StaffService.getPaymentInfo(billment.tableId)
      // setBillMent({...billment,pmts})
      setOpenTypeCoupon(false)
      // setPromotionOfStore(_p)
  }
  return (
    <Fragment>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>Khuyến mãi:</div>
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
      {/* <CustomAlert type={messageBox.type} closeMessage={handleCloseMessageBox} message={messageBox.message} open={messageBox.open} />       */}

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
                    {promotionOfStore.filter(p=>p.quantity_apply !==0).map((p=>(
                      <li>{p.quantity_apply} x {p.name}</li>
                    )))}
                </ul>
            </Grid>
          </TabPanel>
          <DialogActions>
            <Button onClick={handleCloseTypeCoupon}>Hủy</Button>
            <Button onClick={()=>setOpenTypeCoupon(false)}>Xác nhận</Button>
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

export default Coupon;
