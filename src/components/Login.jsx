import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import * as auth from '../utils/auth';



function Login({ handelLoginCheck }) {
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

    if (!userInfo.username || !userInfo.password) {
      return;
    }

    handleLogin(userInfo)
      .then(() => {
        setUserData({ email: "", password: "" });
        setMessage("");
      })
      .catch((error) => {
        setMessage(`Что-то пошло не так! ${error} `);
      });
  }
  return (
    <div onSubmit={handleSubmit} className="login">
      <Logo title={"CryptoDucks"} />
      <p className="login__welcome">
        Это приложение содержит конфиденциальную информацию. Пожалуйста, войдите
        или зарегистрируйтесь, чтобы получить доступ к CryptoDucks.
      </p>
      <p className="login__error">{message}</p>
      <form className="login__form">
        <label htmlFor="username">Логин:</label>
        <input
          id="username"
          required
          name="username"
          type="text"
          value={userData.username || ""}
          onChange={handleChange}
        />
        <label htmlFor="password">Пароль:</label>
        <input
          id="password"
          required
          name="password"
          type="password"
          value={userData.password || ""}
          onChange={handleChange}
        />
        <div className="login__button-container">
          <button type="submit" className="login__link">
            Войти
          </button>
        </div>
      </form>

      <div className="login__signup">
        <p>Ещё не зарегистрированы?</p>
        <Link to="/register" className="signup__link">
          Зарегистрироваться
        </Link>
      </div>
    </div>
  );
}

export default Login;


