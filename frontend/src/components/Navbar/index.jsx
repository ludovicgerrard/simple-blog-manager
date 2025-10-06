import { useActionState, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import Dropdown from "@mui/joy/Dropdown";
import { Container } from "@mui/material";
import Input from "@mui/joy/Input";

import { Box, Button, Typography, Stack } from "@mui/joy";

import { AuthContext } from "@/services/authService";
import useFetch from "@/hooks/useFetch";
import { toast } from "react-toastify";

import logo from "@/assets/img/logo.svg";

function Navbar() {
  return (
    <Container sx={{ py: 1, mb: 2 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img src={logo} alt="Logo" height={20} />
          <Typography level="title-lg">Blog Three</Typography>
        </Box>
        <Stack spacing={1} direction="row">
          <AuthMenu />
        </Stack>
      </Stack>
    </Container>
  );
}

function AuthMenu() {
  const navigate = useNavigate();

  let { isAuth, signout } = useContext(AuthContext);
  const [auth, authLogoutApi, cancelAuthApi] = useFetch("/api/auth/logout");

  const goRegister = () => navigate("/register");

  const logout = () => {
    authLogoutApi({}, "post").then((resp) => {
      if (!resp.success) {
        toast.error("Logout failed!");
        return;
      }

      signout();
    });
  };

  const goAddPost = () => navigate("/add-post");

  if (isAuth) {
    return (
      <>
        <Button size="sm" onClick={goAddPost}>
          Add Post
        </Button>
        <Button size="sm" onClick={logout} variant="outlined">
          Logout
        </Button>
      </>
    );
  }
  return (
    <>
      <Button size="sm" variant="solid" onClick={goRegister}>
        Register
      </Button>
      <LoginMenu />
    </>
  );
}

function LoginMenu() {
  const [open, setOpen] = useState(false);

  const handleOpenChange = useCallback((event, isOpen) => {
    setOpen(isOpen);
  }, []);

  const [auth, authApi, cancelAuthApi] = useFetch("/api/auth/login");
  let { signin, addUserInfo } = useContext(AuthContext);

  const [formErrors, setFormErrors] = useState(undefined);
  const [state, formAction, isPending] = useActionState(signInAction, {
    message: "",
    error: false,
  });

  async function signInAction(prevState, formData) {
    setFormErrors(undefined);
    authApi(formData, "post").then(async (resp) => {
      if (!resp.success) {
        toast.error("Login failed!");
        return;
      }

      await signin(resp.data.token.value);
      await addUserInfo(resp.data.user);

      setOpen(false);
    });
  }

  return (
    <Dropdown open={open} onOpenChange={handleOpenChange}>
      <MenuButton size="sm" variant="outlined">
        Login
      </MenuButton>
      <Menu placement="bottom-end">
        <form action={formAction}>
          <Stack
            direction="column"
            spacing={1}
            sx={{
              justifyContent: "center",
              alignItems: "stretch",
              px: 1,
            }}
          >
            <Input placeholder="email" name="email" type="email" />

            <Input type="password" name="password" />

            <Button type="submit" loading={auth.loading}>
              Login
            </Button>
          </Stack>
        </form>
      </Menu>
    </Dropdown>
  );
}

export default Navbar;
