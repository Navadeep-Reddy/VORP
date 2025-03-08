import { BrowserRouter, Routes, Route } from "react-router-dom"
import MapPage from './pages/MapPage'
import LocationProvider from './context/LocationContext'
import HomePage from "./pages/HomePage"

const App = () => {
  return (
    <LocationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/route" element={<MapPage />}></Route>
          <Route path= '/' element={<HomePage />}></Route>
        </Routes> 
      </ BrowserRouter>
    </LocationProvider>
  )
}

export default App