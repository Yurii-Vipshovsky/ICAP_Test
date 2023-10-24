import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { userLogout } from '../../redux/reducers/userSlice';
import { RootState } from '../../redux/store';
import './Header.css'

function Header () {

  const userLogin = useSelector<RootState, boolean>(state => state.user);
  const dispatch = useDispatch();

  const handleLogOut = () =>{
    dispatch(userLogout(null));
  }

  return (
    <header>
      <h1>Technical task</h1>
      {userLogin && <button><Link className='login-link' to="/table">Таблиця</Link></button>}
      {userLogin ? <button onClick={handleLogOut}>Вийти!</button> : <button><Link className='login-link' to="/login">Увійти</Link></button>}
    </header>
  );
};

export default Header;