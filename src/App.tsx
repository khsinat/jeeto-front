
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router"
import RootLayout from "./layouts/RootLayout"
export const iframeHeight = "800px"
export const description = "A sidebar with a header and a search form."

import Home from "./pages/Home"
import WalletPage from "./pages/WalletPage"
import LoginPage from "./pages/LoginPage"
import GamePage from "./pages/GamePage"
import NotificationsPage from "./pages/NotificationsPage"
import ProfilePage from "./pages/ProfilePage"
import Faq02 from "./pages/ExtraPages/FAQ"
import { Help } from "./pages/ExtraPages/Help"
import PrivacyPolicy from "./pages/ExtraPages/PrivacyPolicy"
import TermsAndConditions from "./pages/ExtraPages/TermsAndConditions"
import ResponsiblePlayNotice from "./pages/ExtraPages/ResponsiblePlayNotice"

function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/" element={<RootLayout />} >
        <Route index element={<Home />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/game/:gameId" element={<GamePage />} />
        <Route path="/wallet" element={<WalletPage />}></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>
        <Route path="/FAQ" element={<Faq02 />}></Route>
        <Route path="/help" element={<Help />}></Route>
        <Route path="/terms&conditions" element={<TermsAndConditions />}></Route>
        <Route path="/privacypolicy" element={<PrivacyPolicy />}></Route>
        <Route path="/responsibleplaynotice" element={<ResponsiblePlayNotice />}></Route>
      </Route>
    </>
  ))
  return (
    <RouterProvider router={router} />
  )
}

export default App
