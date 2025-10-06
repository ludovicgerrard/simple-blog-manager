import { BrowserRouter } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import RouteWay from "@/routeWay";

function App() {
  return (
    <>
      <BrowserRouter>
        <RouteWay />
      </BrowserRouter>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
    </>
  );
}

export default App;
