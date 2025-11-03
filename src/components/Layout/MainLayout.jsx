import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const MainLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      {/* Main Content with minimum height */}
      <main 
        className="flex-grow-1" 
        style={{ 
          marginTop: "65px",
          minHeight: "calc(100vh - 65px - 900px)" // Adjust 900px to your footer height
        }}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;