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
  background-size: cover;
  align-items: center;
  height: 100vh;
  background-image: url(${Background});
  background-position: center;
`;
const Form = styled.div`
  height: 40%;
  width: 40%;
  background-color: #fff;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  border-radius: 20px;
`;
const Input = styled.input`
  border: 1px solid #333;
  height: 50px;
  &:focus {
    outline: none;
  }
  border-radius: 5px;
  width: 70%;
  font-size: 20px;
  padding-left: 20px;
`;
const Button = styled.button`
  background-color: #dc143c;
  font-size: 20px;
  height: 15%;
  margin-top: 5%;
  width: 40%;
  border-radius: 10px;
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
  const handleInputPhone = (event: any) => {
    setForm({
      phone_number: event.currentTarget.value,
      password: form.password,
    });
  };
  useEffect(()=>{
    if(error!==null){
        setMessagBox({type:"warning",open:true,message:"Tài khoản hoặc mật khẩu không đúng"})
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
        <Input
          value={form.phone_number}
          onChange={handleInputPhone}
          placeholder="Tài khoản"
        />
        <Input
          value={form.password}
          onChange={handleInputPassword}
          type="password"
          style={{ marginTop: '5%' }}
          placeholder="Mật khẩu"
        />
        <Button disabled={loading} onClick={submit}>Đăng nhập</Button>
      </Form>
      <CustomAlert type={messageBox.type} closeMessage={handleCloseMessageBox} message={messageBox.message} open={messageBox.open} />      
    </Wrapper>
  );
};

export default LoginPage;
