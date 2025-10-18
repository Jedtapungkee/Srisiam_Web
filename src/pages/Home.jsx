import React from 'react'
import Hero from '../components/Home/Hero'
import { Megaphone } from 'lucide-react';
import CategoryCards from '../components/Home/CategoryCard';
const Home = () => {
  return (
    <div>
      <Hero />
      <div className='mt-10 text-left px-5'>
        <h3>
          <Megaphone className='inline mr-2'/>"ร้าน SRISIAM จำหน่ายชุดยูนิฟอร์มนักเรียนคุณภาพดี ใส่สบาย ราคาเหมาะสม พร้อมมาตรฐานโรงเรียน ครบทุกระดับชั้น"
        </h3>
      </div>
      <CategoryCards />
    </div>
  )
}

export default Home