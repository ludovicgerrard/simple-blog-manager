import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Stack from "@mui/joy/Stack";

import { Button } from "@mui/joy";

function Navbar() {
  const navigate = useNavigate();

  const goRegister = () => navigate("/register");

  return (
    <Container sx={{ py: 1 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>logo</div>
        <Stack spacing={1} direction="row">
          <Button size="sm" variant="outlined" onClick={goRegister}>
            Register
          </Button>
          <Button size="sm">Login</Button>
        </Stack>
      </Stack>
    </Container>
  );
}

export default Navbar;
