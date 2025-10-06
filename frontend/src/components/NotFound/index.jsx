import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import Button from "@mui/joy/Button";

import "./style.css";

const NotFound = () => {
  let navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 1,
        px: { xs: 4, sm: 4 },
      }}
    >
      <Button
        size="sm"
        variant="plain"
        startDecorator="←"
        onClick={() => navigate("/")}
      >
        Return
      </Button>
      <div className="page_404">Page non trouvée</div>
    </Container>
  );
};

export default NotFound;
