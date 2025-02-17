import React from 'react'
import {  Route, Routes } from 'react-router-dom';
import Guestlayout from '../layouts/Guestlayout';


import IndexHome from '../Checkers/IndexHome';

import CheckersComp from '../Checkers/VsComputer/CheckersComp';
import Checker from '../Checkers/VsOne/Checker';




const Router = () => {
  return (

    <Routes>
      <Route path='/' element={<Guestlayout/>}>
        <Route index element={<IndexHome />} />
        <Route path='vsOne' element={<Checker />} />
        <Route path='vsComp' element={<CheckersComp />} />
   
  

      </Route>
      
    </Routes>

  );
};

export default Router