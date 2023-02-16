import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as auth from '../utils/auth';

function Register() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState("")

  function handleChange(e) {
    const { name, value } = e.target;

    setUserInfo({
      ...userInfo,
      [name]: value,
    })
  }

  function handleSubmit(e) {
    e.preventDefault();
    auth.register(password, email)
      .then(() => {
        setMessage("")
        navigate("/home")
      }).cath((error) => {
        setMessage(`Что-то пошло не так! ${error}`)
      }
      )
  }

  return (
    <main className="content">
      <p className="register__welcome">
        Регистрация
      </p>
      <p className="register__error">{message}</p>
      <form onSubmit={handleSubmit} className="register__form">
        <label htmlFor="email">
          Email:
        </label>
        <input id="email" name="email" type="email" value={userInfo.email || ''} onChange={handleChange} />
        <label htmlFor="password">
          Пароль:
        </label>
        <input id="email" name="email" type="email" value={userInfo.password || ''} onChange={handleChange} />
        <div className="register__button-container">
          <button type="submit" onSubmit={handleSubmit} className="register__link">Зарегистрироваться</button>
        </div>
      </form>
      <div className="register__signin">
        <p>Уже зарегистрированы?</p>
        <Link to="login" className="register__login-link">Войти</Link>
      </div>
    </main>
  );


}

export default Register;
