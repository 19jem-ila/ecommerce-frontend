import React, { useEffect } from 'react';
import Banner from "../../components/banner/Banner"
import Brands from "../../components/brands/Brands"
import StoreVisit from "../../components/VisitStore/visitstore"
import { Link } from 'react-router-dom';



const Home = () => {
  return (
    <>
      <Banner/>
      <Brands/>
      <StoreVisit/>
     
    </>
  );
};

export default Home;