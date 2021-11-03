import React from 'react';
import { BrowserRouter,Route } from 'react-router-dom';
import Main from "./routes/Main";
import Login from "./routes/Login";

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact={true} component={Login}></Route>
      <Route path="/baseball" component={Main}></Route>
    </BrowserRouter>
  );
}

export default App;
