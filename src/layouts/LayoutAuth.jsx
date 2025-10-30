import React from 'react'
import { Outlet } from 'react-router-dom'

const LayoutAuth = () => {
  return (
    <div className="min-h-screen bg-gray-50">
        <main className='w-full h-full overflow-hidden'>
          <Outlet />
        </main>
    </div>
  )
}

export default LayoutAuth