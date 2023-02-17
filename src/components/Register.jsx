import React, { useState } from "react";
import { Link, } from "react-router-dom";


function Register({ handleRegisterClick }) {

  const [userInfo, setUserInfo] = useState({
    email: ''
  });

  const [message, setMessage] = useState("")

  function handleChange(e) {
    const { email, value } = e.target;

    setUserInfo({
      ...userInfo,
      [email]: value,
    })
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!userInfo.password || !userInfo.email) {
      handleRegisterClick(userInfo);
    }
    handleRegisterClick()
      .then(() => {
        setMessage("")

      })
      .cath((error) => {
        setMessage(`Что-то пошло не так! ${error}`)
      }
      )
  }

  return (
    <main className="register">
      <p className="register__welcome">
        Регистрация
      </p>
      <p className="register__error">{message}</p>
      <form onSubmit={handleSubmit} className="register__form" onChange={handleChange}>
        <input id="email" name="email" type="email" value={userInfo.email || ''} />
        <input id="password" name="password" type="password" value={userInfo.password || ''} />
        <div className="register__button-container">
          <button type="submit" onSubmit={handleSubmit} onChange={handleChange} className="register__link">Зарегистрироваться</button>
        </div>
      </form>
      <div className="register__signin">
        <p>Уже зарегистрированы?</p>
        <Link to="/" className="register__login-link">Войти</Link>
      </div>
    </main >
  );


}

export default Register;
