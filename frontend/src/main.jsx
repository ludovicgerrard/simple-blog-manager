import React from "react";
import ReactDOM from "react-dom/client";

import "@/assets/styles/index.css";
import App from "@/pages/App";

import AuthProvider from "@/services/provider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.Fragment>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.Fragment>
);
