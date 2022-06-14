import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout"
import { ThemeProvider } from '@mui/system';
import  theme  from './theme';
import React from 'react'
import Thanks from "./components/Thanks";
export const config = {
  endpoint: `https://qkart-frontend-yas.herokuapp.com/api/v1`,
};
 
function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Products />
        </Route>

        <Route exact path="/checkout">
          <Checkout />
        </Route>
        <Route exact path="/thanks">
          <Thanks />
        </Route>

        <Route exact path="/products">
          <Products />
        </Route>

        <Route exact path="/register">
          <Register />
        </Route>

        <Route exact path="/login">
          <Login />
        </Route>
      </Switch>
    </div>
  );
}
 
export default App;
