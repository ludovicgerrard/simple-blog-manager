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
const Post = lazy(() => import("@/pages/Post"));
const AddUpdatePost = lazy(() => import("@/pages/Post/AddUpdatePost"));

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
        <Route path="/auth-logged" element={<Redirection />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <Layout
              transitionStage={transitionStage}
              handleAnimation={handleAnimation}
            />
          }
        >
          <Route path="/" index element={<Blogs />} />
          <Route path="/post">
            <Route path=":id" element={<Post />} />
          </Route>
        </Route>
        <Route
          path="/add-post"
          element={
            <RequireAuth>
              <AddUpdatePost />
            </RequireAuth>
          }
        />
        <Route path="/update-post">
          <Route path=":id" element={<AddUpdatePost />} />
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
