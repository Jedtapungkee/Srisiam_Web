import React from 'react'
import Hero from '../components/Home/Hero'
import { Megaphone } from 'lucide-react';
import CategoryCards from '../components/Home/CategoryCard';

const Home = () => {
  return (
    <div>
      {/* Hero Section - Full Viewport Width */}
      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 w-screen">
          <Hero />
        </div>
        <div className="w-full h-60 sm:h-72 md:h-80 lg:h-96 xl:h-[28rem] 2xl:h-[32rem]"></div>
      </div>
      
      <div className="space-y-6 sm:space-y-8 lg:space-y-10 mt-6 sm:mt-8 lg:mt-10">
        <div className='px-4 sm:px-6 lg:px-8'>
          <div className='bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 rounded-lg'>
            <h3 className='flex items-start text-gray-800 text-sm sm:text-base lg:text-lg leading-relaxed'>
              <Megaphone className='inline-block mr-2 mt-1 flex-shrink-0 text-blue-600 h-4 w-4 sm:h-5 sm:w-5'/>
              <span>"ร้าน SRISIAM จำหน่ายชุดยูนิฟอร์มนักเรียนคุณภาพดี ใส่สบาย ราคาเหมาะสม พร้อมมาตรฐานโรงเรียน ครบทุกระดับชั้น"</span>
            </h3>
          </div>
        </div>
        <CategoryCards />
      </div>
    </div>
  )
}

export default Home