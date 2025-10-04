import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/joy/CircularProgress";
import Box from "@mui/joy/Box";

import { AuthContext } from "@/services/authService.js";
import useFetch from "@/hooks/useFetch.js";

function Redirection() {
  const navigate = useNavigate();
  let { signin, addUserInfo } = useContext(AuthContext);
  const [profil, profilApi, cancelProfilApi] = useFetch("/profil/user");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      signin(token);
      profilApi().then((resp) => {
        addUserInfo(resp);
        navigate("/");
      });
    }
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  );
}

export default Redirection;
