import React from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Mail, 
  Facebook, 
  Instagram, 
  MessageCircle,
  Heart,
  ExternalLink
} from 'lucide-react';

const MainFooter = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 text-white mt-12">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-300 mb-6 flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              ติดต่อเรา
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 hover:text-blue-200 transition-colors">
                <Phone className="h-4 w-4 text-blue-300" />
                <span className="font-medium">032-211-856</span>
              </div>
              <div className="flex items-center space-x-3 hover:text-blue-200 transition-colors">
                <Phone className="h-4 w-4 text-blue-300" />
                <span className="font-medium">089-123-4567</span>
              </div>
              <div className="flex items-center space-x-3 hover:text-blue-200 transition-colors">
                <Mail className="h-4 w-4 text-blue-300" />
                <span className="font-medium">info@srisiam.com</span>
              </div>
              <div className="flex items-center space-x-3 hover:text-blue-200 transition-colors">
                <MessageCircle className="h-4 w-4 text-green-400" />
                <span className="font-medium">Line: @srisiam</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-300 mb-6 flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              ที่อยู่
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-blue-300 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium leading-relaxed">
                    109 ถนนประชาธิปัต ตำบลศาลาใหม่<br />
                    อำเภอศาลาใหม่ จังหวัดนครปฐม<br />
                    <span className="text-blue-200">70110</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <ExternalLink className="h-4 w-4 text-blue-300" />
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-200 underline text-sm"
                >
                  ดูแผนที่ Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-300 mb-6 flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              เวลาทำการ
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-blue-300" />
                <div>
                  <p className="font-medium">จันทร์ - เสาร์</p>
                  <p className="text-blue-200">7:00 - 20:00น.</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-red-300" />
                <div>
                  <p className="font-medium">วันอาทิตย์</p>
                  <p className="text-red-200">ปิดทำการ</p>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg  ">
                <p className="text-sm text-white">
                  <span className="font-semibold">หมายเหตุ:</span> รับออร์เดอร์ออนไลน์ 24/7
                </p>
              </div>
            </div>
          </div>

          {/* Company & Social */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-300 mb-6">
              เกี่ยวกับ Srisiam
            </h3>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                ร้านเครื่องแบบนักเรียนคุณภาพสูง มีประสบการณ์กว่า 15 ปี 
                ให้บริการเครื่องแบบนักเรียนครบครัน ราคาเป็นมิตร
              </p>
              
              {/* Social Media */}
              <div>
                <h4 className="font-semibold text-gray-200 mb-3">ติดตามเรา</h4>
                <div className="flex space-x-3">
                  <a 
                    href="#" 
                    className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a 
                    href="#" 
                    className="bg-pink-600 hover:bg-pink-700 p-2 rounded-full transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a 
                    href="#" 
                    className="bg-green-600 hover:bg-green-700 p-2 rounded-full transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold text-gray-200 mb-3">ลิงก์ด่วน</h4>
                <div className="space-y-2 text-sm">
                  <a href="/products" className="block text-gray-300 hover:text-blue-200 transition-colors">
                    • สินค้าทั้งหมด
                  </a>
                  <a href="/size-guide" className="block text-gray-300 hover:text-blue-200 transition-colors">
                    • คู่มือเลือกไซส์
                  </a>
                  <a href="/shipping" className="block text-gray-300 hover:text-blue-200 transition-colors">
                    • นโยบายการส่งสินค้า
                  </a>
                  <a href="/return" className="block text-gray-300 hover:text-blue-200 transition-colors">
                    • นโยบายการคืนสินค้า
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-600 bg-slate-800/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-300 text-sm">
                © 2025 Srisiam School Uniform Store. สงวนลิขสิทธิ์ทุกรูปแบบ
              </p>
              <p className="text-gray-400 text-xs mt-1">
                ออกแบบและพัฒนาโดย Srisiam Team
              </p>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <a href="/privacy" className="hover:text-blue-200 transition-colors">
                นโยบายความเป็นส่วนตัว
              </a>
              <span className="text-gray-500">|</span>
              <a href="/terms" className="hover:text-blue-200 transition-colors">
                เงื่อนไขการใช้งาน
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;