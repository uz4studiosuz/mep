import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainLayout from "./layout/MainLayout";
import Home from "./Home";
import Vaqtinchalik from "./components/Vaqtinchalik";
import AskMedicalAI from "./components/AskMedicalAI";
import Video from "./components/Video";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";

const userRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/temporarilyunavailable" element={<Vaqtinchalik />} />
      <Route path="/medicalAI" element={<AskMedicalAI />} />
      <Route path="/video" element={<Video />} />
    </Route>
  )
);

const adminRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="*" element={<AdminDashboard />} />
  )
);

function AppRoutes() {
  const { role } = useAuth();

  if (!role) return <LoginPage />;
  if (role === "admin") return <RouterProvider router={adminRouter} />;
  return <RouterProvider router={userRouter} />;
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
