import { useState, useEffect, useContext, lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

//Compo
import NotFound from "@/components/NotFound";
import Layout from "@/components/Layout";
import { AuthContext } from "@/services/authService";
import PageLoader from "@/components/PageLoader";

//All pages
const Blogs = lazy(() => import("@/pages/Blogs"));
const Register = lazy(() => import("@/pages/User/Register"));
const Redirection = lazy(() => import("@/components/Redirection"));

const RouteWay = () => {
  const location = useLocation();

  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransistionStage] = useState("fadeIn");

  const handleAnimation = () => {
    if (transitionStage === "fadeOut") {
      setTransistionStage("fadeIn");
      setDisplayLocation(location);
    }
  };

  useEffect(() => {
    if (location !== displayLocation) setTransistionStage("fadeOut");
  }, [location, displayLocation]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="*" element={<NotFound />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/auth-logged" element={<Redirection />} />

        <Route
          element={
            <Layout
              transitionStage={transitionStage}
              handleAnimation={handleAnimation}
            />
          }
        >
          <Route path="/" index element={<Blogs />} />

          {/* <Route
            path="/who"
            element={
              <RequireAuth>
                <MyWho />
              </RequireAuth>
            }
          />

          <Route path="/who">
            <Route
              path=":id"
              element={
                <RequireAuth>
                  <Who />
                </RequireAuth>
              }
            />
          </Route> */}
        </Route>
      </Routes>
    </Suspense>
  );
};

export default RouteWay;

function RequireAuth({ children }) {
  let { isAuth } = useContext(AuthContext);
  return !isAuth ? <Navigate to="/" replace={true} /> : children;
}
