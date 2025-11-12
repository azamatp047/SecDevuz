import { Toaster } from "react-hot-toast"
import { Navigate, Outlet } from "react-router-dom"
const ProtectedRoute: React.FC = () => {
  const accessToken = localStorage.getItem("secdevAccessToken")


  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Outlet />
    </>
  )
}


export default ProtectedRoute
