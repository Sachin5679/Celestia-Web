import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import { useEffect } from "react";
import Footer from "./common/Footer";
import Navbar from "./common/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import { GlobalContextProvider } from "./contexts/globalContext";
import Cursor from "./common/Cursor";
import AdminPage from "./pages/AdminPage/AdminPage";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    )
  );

  return (
    <GlobalContextProvider>
      <RouterProvider router={router} />
    </GlobalContextProvider>
  );
}

function Root() {
  useEffect(() => {
    window.addEventListener("resize", () => {
      location.reload();
    });
  }, []);

  return (
    <main className="relative">
      {/* <Cursor /> */}
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  );
}
