import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import Background from '../../assets/images/login-bg.jpg';
import { login, userSelector } from '../../features/user/userSlice';
import { DASHBOARD } from '../../constants/routes';
import CustomAlert from '../../components/Alert';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  background-size: 100% 100%;
  align-items: center;
  height: 100vh;
  background-image: url(${Background});
  background-position: center;
  background-repeat:no-repeat;
`;
const Form = styled.div`
  height: 40%;
  width: 30%;
  background-color: #fff;
  display: flex;
  padding-left:5%;
  padding-right:5%;
  justify-content:center;
  padding-bottom:20px;
  flex-direction: column;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  border-radius: 20px;
`;
const Input = styled.input`
  border: 1px solid #333;
  height: 20%;
  &:focus {
    outline: none;
  }
  border-radius: 5px;
  width: auto;
  font-size: 20px;
  padding-left: 20px;
`;
const Button = styled.button`
  background-color: #dc143c;
  font-size: 20px;
  height: 50px;
  margin-top: 5%;
  width: 40%;
  border-radius: 10px;
  box-shadow:none;
  border:none;
  margin-left:auto;
  margin-right:auto;
  color: #fff;
  &:focus {
    outline: none;
  }
  &:hover {
    cursor: pointer;
  }
`;

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    phone_number: '',
    password: '',
  });
  const [messageBox, setMessagBox] = useState({
    open: false,
    message: "",
    type: "",
  });
  const {
    user: { token },
    loading,
    error
  } = useSelector(userSelector);
  const [errorInput,setErrorInput] = useState(false)
  const handleInputPhone = (event: any) => {
    if(event.target.value.length > 12){
      event.preventDefault()
      return
    }
    setForm({
      phone_number: event.currentTarget.value,
      password: form.password,
    });
  };
  useEffect(()=>{
    const regex = /^[0-9]*$/gm
    const valid = regex.test(form.phone_number)
    setErrorInput(valid)
  },[form])
  useEffect(()=>{
    if(error!==null){
        setMessagBox({type:"error",open:true,message:"Tài khoản hoặc mật khẩu không đúng"})
    }
  },[error])
  const handleInputPassword = (event: any) => {
    setForm({
      phone_number: form.phone_number,
      password: event.currentTarget.value,
    });
  };
  const handleCloseMessageBox =() =>{
    setMessagBox({...messageBox,open:false})
  }
  const submit = async () => {
    if (form.phone_number === '' || form.password === '') {
      return;
    }
    dispatch(
      login({ phone_number: form.phone_number, password: form.password })
    );
  };
  return (
    <Wrapper>
      {token !== '' && <Redirect to={DASHBOARD} />}
      <Form>
        <h2 style={{marginLeft:"auto",marginRight:"auto"}}>Đăng nhập</h2>
        <h3 style={{margin:0}}>Số điện thoại</h3>
        <Input
          value={form.phone_number}
          type="number"
          onChange={handleInputPhone}
          placeholder="Nhập số điện thoại"
        />
        {(!errorInput && form.phone_number !== '') && <div style={{color:'red'}}>Số điện thoại không hợp lệ</div>}
        <h3 style={{margin:0}}>Mật khẩu</h3>
        <Input
          value={form.password}
          onChange={handleInputPassword}
          type="password"
          placeholder="Nhập mật khẩu"
        />
        <Button style={{backgroundColor:"#444444"}} disabled={loading} onClick={submit}>Đăng nhập</Button>
      </Form>
      <CustomAlert anchorOrigin={{horizontal:"right",vertical:"top"}} type={messageBox.type} closeMessage={handleCloseMessageBox} message={messageBox.message} open={messageBox.open} />      
    </Wrapper>
  );
};

export default LoginPage;
