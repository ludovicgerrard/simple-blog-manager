import { Container } from "@mui/material";
import Stack from "@mui/joy/Stack";

import { Button } from "@mui/joy";

function Navbar() {
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
          <Button size="sm" variant="outlined">
            Register
          </Button>
          <Button size="sm">Login</Button>
        </Stack>
      </Stack>
    </Container>
  );
}

export default Navbar;
