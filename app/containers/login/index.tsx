import React, { useEffect, useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import styled from 'styled-components';
import { stringify } from 'querystring';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router';
import Background from '../../assets/images/login-bg.jpg';
import { login, userSelector } from '../../features/user/userSlice';
import UserService from '../../services/user';
import { DASHBOARD } from '../../constants/routes';

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
    phone_number: '0942137889',
    password: '123456',
  });
  const {
    user: { token },
    error,
    loading,
  } = useSelector(userSelector);
  const history = useHistory();
  const handleInputPhone = (event: any) => {
    setForm({
      phone_number: event.currentTarget.value,
      password: form.password,
    });
  };
  const handleInputPassword = (event: any) => {
    setForm({
      phone_number: form.phone_number,
      password: event.currentTarget.value,
    });
  };
  const submit = async () => {
    if (form.phone_number === '' || form.password === '') {
      return;
    }
    dispatch(
      login({ phone_number: form.phone_number, password: form.password })
    );
  };
  // useEffect(()=>{
  //   console.log(token)
  // },[token])
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
        <Button onClick={submit}>Đăng nhập</Button>
      </Form>
    </Wrapper>
  );
};

export default LoginPage;
