import { Route, Routes } from "react-router-dom"
import ExperimentsGallery from "./pages/experiments-gallery"

export function App() {
  return (
    <Routes>
      <Route path="/" element={<ExperimentsGallery />} />
    </Routes>
  )
}

export default App
