import React from 'react'
import AppRoutes from './routes/Approutes'
import { Toaster } from './components/ui/sonner'

const App = () => {
  return (
    <>
    <Toaster richColors position="top-right" />
    <AppRoutes />
    </>
  )
}

export default App