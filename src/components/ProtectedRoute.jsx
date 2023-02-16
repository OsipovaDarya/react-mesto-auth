import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...props }) => {
  console.log('fsdfsdf', props.loggedIn)
  return (
    props.loggedIn ? <Component {...props} /> : <Navigate to="/sign-in" />
  )
}

export default ProtectedRoute;
