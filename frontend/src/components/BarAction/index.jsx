import { useNavigate } from "react-router-dom";

import { Container } from "@mui/material";
import Box from "@mui/joy/Box";
import { Button } from "@mui/joy";

function BarAction() {
  const navigate = useNavigate();
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 1 }}>
        <Button
          size="sm"
          variant="plain"
          startDecorator="←"
          onClick={() => navigate("/")}
        >
          Return
        </Button>
      </Box>
    </Container>
  );
}

export default BarAction;
