
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer"


const MainLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow-1" style={{ marginTop: "65px" }}>
        <Outlet />
      </main>

      <Footer/>

     
    </div>
  );
};

export default MainLayout;
