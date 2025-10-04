import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";

import Navbar from "@/components/Navbar";

const Layout = ({ transitionStage, handleAnimation }) => {
  return (
    <>
      <Navbar />
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 14, sm: 16 },
          px: { xs: 4, sm: 6 },
        }}
        className={`${transitionStage}`}
        onAnimationEnd={handleAnimation}
      >
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
