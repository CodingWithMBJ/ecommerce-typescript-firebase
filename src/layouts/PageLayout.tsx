import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const PageLayout = () => {
  return (
    <div className="wrapper">
      <Header />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default PageLayout;
