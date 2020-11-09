import React, { Fragment, useContext, useEffect,useState } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { Order } from '../types';
import Checkbox from '@material-ui/core/Checkbox';
import { Context } from '../Context';
import { convertToVnd } from '../../../../../utils';
import { Button } from '@material-ui/core';
import {Topping} from '../types'

const SelectTopping = (props:Order) =>{ 
    const [] = useState(true)
    const [options,setOptions] = useState<any[]>([])
    const [toppings,setToppings] = useState<Topping[]>([])
    const {billment,setBillMent,setOpenSelectTopping,openSelectTopping} = useContext(Context)
    useEffect(()=>{
        let toppings  = props.toppings
        toppings?.forEach(topping=>{
            topping.selected = false
        })
        setToppings(toppings)
        let options : Array<any> = Array.from(new Set(props.options.map(x=> x.type)))
        options = options.map(type=>({type:type,options: props.options?.filter(option =>{
            if(option.type === type){
                if(option.default === "true"){
                    option.selected = true
                }else{
                    option.selected = false
                }
                return option
            }
        })}))
        setOptions(options)
    },[])  
    const addToOrders  = () => {
        let nameOptions = []
        let  toppingPrice = 0
        console.log(toppings)
        let _topping  = []
        toppings.forEach((topping)=>{
            if(topping.selected === true){
                toppingPrice+= topping.price
                _topping.push(topping.id+":-:"+topping.name+":-:"+topping.price)
            }
        })
        options.forEach((o)=>{
            o.options.forEach(o=>{
                if(o.selected === true){
                    if(o.price !== ""){
                        toppingPrice+= Number.parseFloat(o.price)
                    }
                    nameOptions.push(o.type +" "+ o.value)
                }
            })
        })
        setBillMent({...billment,payment_info:{total : billment.payment_info?.total + props.price + (toppingPrice || 0),sub_total:billment.payment_info?.sub_total + props.price + (toppingPrice||0)},orders:[...billment.orders,{
            name : props.name + "(" + nameOptions.join(" ") + ")",
            price: props.price,
            amount:props.price + toppingPrice,
            foodId:props.foodId,
            quantity:1,
            stt:props.stt,
            topping:_topping,
            toppingPrice,
            index: billment.orders.length,
        }]})
        setOpenSelectTopping(false)
    }
    const updateOption = (option) => {
        let _options = options
        _options.forEach(_option=>{
            _option.options.forEach(_o=>{
                if(_o.value == option.value && _o.type == option.type){
                    _o.selected = true
                }
                if(_o.value !== option.value && _o.type == option.type){
                    _o.selected = false
                }
            })
        })
        setOptions([...options])
    }        
    const selectTopping  = (topping:Topping) => {
        let _toppings : Topping[] = toppings
        _toppings.forEach(_topping=>{
            if(topping.id === _topping.id){
                _topping.selected = !_topping.selected
            }
        })
        setToppings([..._toppings])
    }
    return ( 
        <Fragment>
            <Dialog open={openSelectTopping} onClose={()=>setOpenSelectTopping(false)} maxWidth="md" fullWidth>
                <DialogContent>
                        <div style={{display:'flex'}}>
                            <div>
                                <img height="150" width="150" src={props.image} />
                            </div>
                            <div>
                                <ul style={{listStyleType:'none'}}>
                                    <li><h2>{props.name}</h2></li>
                                    <li>Giá: {props.price}</li>
                                </ul>
                            </div>
                        </div>
                        <div style={{textAlign:"center"}}>
                            <h2>Lựa chọn</h2>
                        </div>
                        <div>
                            {options.map((option)=>(
                               <div>
                                   <h5>{option.type}</h5>
                                   <ul>
                                   {option.options.map((o)=>(
                                       <>
                                        <li><Checkbox onChange={()=>updateOption(o)} checked={o.selected} color="primary" />{o.type} {o.value} {o.default=== "true" && "(Mặc định)"} {(o.price > 0) && "+ " +convertToVnd(o.price)}</li>
                                       </>
                                   ))}
                                   </ul>
                                </div> 
                            ))}
                        </div>
                        <div style={{textAlign:"center"}}>
                            <h2>Topping</h2>
                        </div>
                        <div>
                            <ul>
                            {
                                toppings.map((topping)=> (
                                    <>
                                        <li><Checkbox onChange={()=>selectTopping(topping)}  checked={topping.selected} color="primary" />{topping.name}{" + "+convertToVnd(topping.price)}</li>
                                    </>
                                ))
                            }
                            </ul>
                        </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=> setOpenSelectTopping(false)}>
                        Hủy
                    </Button>
                    <Button onClick={addToOrders}>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}

export default React.memo(SelectTopping)