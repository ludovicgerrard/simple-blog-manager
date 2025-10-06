import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";

import Navbar from "@/components/Navbar";

const Layout = ({ transitionStage, handleAnimation }) => {
  return (
    <>
      <Navbar />
      <Container
        className={`${transitionStage}`}
        onAnimationEnd={handleAnimation}
      >
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
