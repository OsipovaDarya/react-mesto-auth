
import { useState } from 'react';
import React from 'react';
import '../index.css';
import Footer from './Footer';
import Header from './Header';
import Main from './Main';
import { useEffect } from 'react';
import api from '../utils/api'
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import * as auth from '../utils/auth';
import Login from './Login';
import Register from './Register';



function App() {
  const [isEditAvatarPopupOpend, setIsEditAvatarOpend] = useState(false);
  const [isEditProfilePopupOpend, setIsEditProfileOpend] = useState(false);
  const [isEditAddPlacePopupOpend, setIsEditAddPlaceOpend] = useState(false);


  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  const [currentUser, setCurrentUser] = useState({});

  const [loggedIn, setloggedIn] = useState(false);
  const [emailInfo, setEmailInfo] = useState("")

  const navigate = useNavigate();

  function handelLoginClick({ password, email }) {
    return auth.authorize(password, email)
      .then((data) => {
        if (data.jwt) {
          localStorage.setItem("jwt", data.jwt)
          setloggedIn(true)
          setEmailInfo(email);
          navigate("/")
        }
      })
  }


  function handelRegistrClick({ email, password }) {
    return auth.register(email, password)
      .then(() => {
        navigate("/")
      })
  }


  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth.checkToken(jwt).then((res) => {
        setloggedIn(true);
        setEmailInfo({
          email: res.email,
        });
        navigate("/");
      });
    }
  }, [navigate]);



  useEffect(() => {
    Promise.all([api.getInfo(), api.getInitialCards()])
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    if (!isLiked) {
      // Отправляем запрос в API и получаем обновлённые данные карточки
      api.addNewlike(card._id, !isLiked)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((err) => {
          console.log(err);
        })

    } else {
      api.deletelikes(card._id, !isLiked)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((err) => {
          console.log(err);
        })
    }

  }

  function handleCardDelete(card) {
    api.deleteCards(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .then(closeAllPopups)
      .catch((err) => {
        console.log(err);
      })
  }

  function handleUpdateUser({ name, about }) {
    api
      .editProfile(name, about)
      .then((user) => {
        setCurrentUser(user);
      })
      .then(closeAllPopups)
      .catch((err) => {
        console.log(err);
      })
  }

  function handleUpdateAvatar({ avatar }) {
    api.changeAvatar(avatar)
      .then((user) => {
        setCurrentUser(user);
      })
      .then(closeAllPopups)
      .catch((err) => {
        console.log(err);
      })
  }

  function handleAddPlaceSubmit(name, link) {
    console.log(name, link)
    api.addNewCard(name, link)

      .then((newCard) => {
        setCards([newCard, ...cards]);
      })
      .then(closeAllPopups)
      .catch((err) => {
        console.log(err);
      })
  }


  function handleCardClick(selectedCard) {
    setSelectedCard(selectedCard)
  }

  function handleEditAvatarClick() {
    setIsEditAvatarOpend(true)
  }

  function handleEditProfileClick() {
    setIsEditProfileOpend(true)
  }

  function handleAddPlaceClick() {
    setIsEditAddPlaceOpend(true)
  }
  function closeAllPopups() {
    setIsEditAvatarOpend(false);
    setIsEditProfileOpend(false);
    setIsEditAddPlaceOpend(false);
    setSelectedCard(null);
  }



  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <div className="page">
          <Header />
          <Routes>
            <Route path='/' element={

              <ProtectedRoute
                component={Main}
                loggedIn={loggedIn}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}

                cards={cards}
                onCardClick={handleCardClick}

                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />}>
            </Route>
            <Route path="/sign-up" element={
              <Register register={handelRegistrClick} />}></Route>
            <Route path="/sign-in" element={
              <Login login={handelLoginClick} />}></Route>

          </Routes>
          <Footer />
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
            isOpen={setSelectedCard}>
          </ImagePopup>

          <EditProfilePopup
            isOpen={isEditProfilePopupOpend}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          ></EditProfilePopup>

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpend}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}>

          </EditAvatarPopup>
          <AddPlacePopup
            isOpen={isEditAddPlacePopupOpend}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          ></AddPlacePopup>

        </div>
      </div>
    </CurrentUserContext.Provider >
  );
}

export default App;
