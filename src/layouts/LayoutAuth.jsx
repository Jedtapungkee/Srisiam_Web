import React from 'react'
import { Outlet } from 'react-router-dom'

const LayoutAuth = () => {
  return (
    <div className='flex h-screen'>
        <main className='flex-1'>
          <Outlet />
        </main>
    </div>
  )
}

export default LayoutAuth