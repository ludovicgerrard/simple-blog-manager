import { useActionState, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Container } from "@mui/material";
import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { Button } from "@mui/joy";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";

import BarAction from "@/components/BarAction";
import useFetch from "@/hooks/useFetch";
import { AuthContext } from "@/services/authService";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  let { signin, addUserInfo } = useContext(AuthContext);
  const formRef = useRef(null);

  const [auth, authApi, cancelAuthApi] = useFetch("/api/auth/register");

  const initialState = { message: "", error: false };
  const [formErrors, setFormErrors] = useState(undefined);
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState
  );

  // Define the action function
  async function signupAction(prevState, formData) {
    setFormErrors(undefined);

    const errors = validate(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(Object.values(errors).join("\n"));
      return;
    }

    authApi(formData, "post").then(async (resp) => {
      if (!resp.success) {
        return;
      }

      toast.success("Registration successful!");
      await signin(resp.data.token.value);
      await addUserInfo(resp.data.user);

      await new Promise((res) => setTimeout(res, 2000));
      navigate("/");
    });

    useEffect(() => {
      function watchReset(e) {
        e.preventDefault();
      }
      const form = formRef.current;
      form?.addEventListener("reset", watchReset);

      return () => {
        form?.removeEventListener("reset", watchReset);
      };
    }, []);
  }

  return (
    <>
      <BarAction />
      <Container maxWidth="xs" sx={{ pt: 4 }}>
        <Typography level="h2" sx={{ fontSize: "xl", mb: 0.5 }}>
          Register
        </Typography>

        <form action={formAction} ref={formRef}>
          <Box sx={{ py: 1 }}>
            <FormControl>
              <FormLabel>Fullname</FormLabel>
              <Input placeholder="Fullname" name="fullName" />
            </FormControl>
          </Box>

          <Box sx={{ py: 1 }}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input placeholder="email" name="email" type="email" />
            </FormControl>
          </Box>

          <Box sx={{ py: 1 }}>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" />
            </FormControl>
          </Box>

          {!!formErrors && (
            <Card variant="outlined" color="danger">
              <Box sx={{ p: 0.1 }}>
                <Typography
                  level="body-xs"
                  textColor="inherit"
                  sx={{ whiteSpace: "pre-line" }}
                >
                  {formErrors}
                </Typography>
              </Box>
            </Card>
          )}

          <Box sx={{ py: 2 }}>
            <Button size="sm" type="submit" disabled={isPending}>
              Register
            </Button>
          </Box>
        </form>
      </Container>
    </>
  );
}

export default Register;

function validate(formData) {
  const errors = {};
  // Fullname: required, at least 2 chars
  if (!formData.get("fullName") || formData.get("fullName").trim().length < 2) {
    errors.fullName = "Full name is required (min 2 characters).";
  }
  // Email: required, valid format
  if (!formData.get("email")) {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(formData.get("email"))) {
    errors.email = "Invalid email format.";
  }
  // Password: required, min 6 chars
  if (!formData.get("password")) {
    errors.password = "Password is required.";
  } else if (formData.get("password").length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  return errors;
}
