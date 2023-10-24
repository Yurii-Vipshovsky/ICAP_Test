import React, { useState } from 'react';
import './Login.css'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { userLogin } from '../../redux/reducers/userSlice';
import { useNavigate } from "react-router-dom";

function Login() {

  const userLoginState = useSelector<RootState, boolean>(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogIn = () =>{
    dispatch(userLogin(null));
  }

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [loginErrors, setLoginErrors] = useState("");

  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      username: '',
      password: '',
    };

    const userNameError = document.getElementById('error-username');
    const passwordError = document.getElementById('error-password');
    const logInError = document.getElementById('error-login');

    if (!formData.username) {
      newErrors.username = 'Обов\'язкове поле';
      if(!userNameError?.classList.contains('active')){
        userNameError?.classList.add('active');
      }
    }
    else{
        if(userNameError?.classList.contains('active')){
            userNameError?.classList.remove('active');
        } 
    }

    if (!formData.password) {
      newErrors.password = 'Обов\'язкове поле';
      if(!passwordError?.classList.contains('active')){
        passwordError?.classList.add('active');
      }
    }
    else{
        if(passwordError?.classList.contains('active')){
            passwordError?.classList.remove('active');
        } 
    }

    if (newErrors.username || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('https://technical-task-api.icapgroupgmbh.com/api/login/', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        handleLogIn();
        if(!logInError?.classList.contains('active')){
          logInError?.classList.remove('active');
        }
        navigate("/table");
      } else {
        // Обробка помилок
        const errorData = await response.json();
        if(!logInError?.classList.contains('active')){
          logInError?.classList.add('active');
        }
        if(errorData?.error === 'Invalid credentials.'){
          setLoginErrors("Невірне ім'я користувача або пароль!")
        }
        else{
          setLoginErrors("Помилка Сервера! Спробуйте пізніше")
        }
      }
    } catch (error) {
      console.error('Помилка під час відправлення запиту:', error);
    }
  };

  return (
    <>
    {userLoginState? 
      <h1>Ви уже увійшли!</h1>
      :
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Ім'я користувача:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <span id='error-username' className="error">{errors.username}</span>
        </div>

        <div>
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <span id='error-password' className="error">{errors.password}</span>
        </div>
        <span id='error-login' className="error">{loginErrors}</span>
        <button type="submit">Увійти</button>
      </form>}
    </>
  );
};

export default Login;