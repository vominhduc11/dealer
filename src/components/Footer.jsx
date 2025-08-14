import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 mt-auto transition-all duration-300 pb-safe md:pb-0">
      <div className="max-w-screen-5xl mx-auto py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 2xl:py-18 3xl:py-20 4xl:py-24 5xl:py-28 px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-16 4xl:px-20 5xl:px-24">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-6 4xl:grid-cols-6 5xl:grid-cols-8 gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 3xl:gap-14 4xl:gap-16 5xl:gap-20 mb-6 sm:mb-7 md:mb-8 lg:mb-10 xl:mb-12 2xl:mb-14 3xl:mb-16 4xl:mb-20 5xl:mb-24">
          {/* Company Info */}
          <div className="lg:col-span-2 3xl:col-span-3 4xl:col-span-3 5xl:col-span-4 text-center md:text-left">
            <div className="mb-5">
              <h3 className="text-primary-500 text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-3xl 2xl:text-4xl 3xl:text-4xl 4xl:text-5xl 5xl:text-6xl font-semibold mb-2 sm:mb-2.5 md:mb-3 lg:mb-3.5 xl:mb-4 2xl:mb-4.5 3xl:mb-5 4xl:mb-6 5xl:mb-7">🎵 TuneZone Dealer</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8 2xl:mb-9 3xl:mb-10 4xl:mb-12 5xl:mb-14 italic text-sm sm:text-base md:text-base lg:text-lg xl:text-xl 2xl:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl">Hệ thống quản lý đại lý chuyên nghiệp</p>
            </div>
            <div className="space-y-2">
              <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2 justify-center md:justify-start">📧 support@tunezone.com</p>
              <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2 justify-center md:justify-start">📞 1900-xxxx</p>
              <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2 justify-center md:justify-start">📍 Hà Nội, Việt Nam</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-slate-900 dark:text-slate-100 text-base sm:text-lg md:text-lg lg:text-xl xl:text-xl 2xl:text-2xl 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl font-semibold mb-3 sm:mb-4 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-7 3xl:mb-8 4xl:mb-10 5xl:mb-12">Liên kết nhanh</h4>
            <ul className="space-y-1.5 sm:space-y-2 md:space-y-2 lg:space-y-2.5 xl:space-y-3 2xl:space-y-3.5 3xl:space-y-4 4xl:space-y-5 5xl:space-y-6">
              <li><button onClick={() => navigate('/products')} className="text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 text-sm sm:text-base md:text-base lg:text-lg xl:text-lg 2xl:text-xl 3xl:text-xl 4xl:text-2xl 5xl:text-3xl cursor-pointer border-none bg-transparent p-0 font-normal">📱 Sản phẩm</button></li>
              <li><button onClick={() => navigate('/warranty')} className="text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 text-sm sm:text-base md:text-base lg:text-lg xl:text-lg 2xl:text-xl 3xl:text-xl 4xl:text-2xl 5xl:text-3xl cursor-pointer border-none bg-transparent p-0 font-normal">🛡️ Bảo hành</button></li>
              <li><button onClick={() => navigate('/cart')} className="text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 text-sm sm:text-base md:text-base lg:text-lg xl:text-lg 2xl:text-xl 3xl:text-xl 4xl:text-2xl 5xl:text-3xl cursor-pointer border-none bg-transparent p-0 font-normal">🛒 Giỏ hàng</button></li>
              <li><a href="mailto:support@tunezone.com" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 text-sm sm:text-base md:text-base lg:text-lg xl:text-lg 2xl:text-xl 3xl:text-xl 4xl:text-2xl 5xl:text-3xl">📧 Liên hệ</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="text-center md:text-left">
            <h4 className="text-slate-900 dark:text-slate-100 text-base sm:text-lg md:text-lg lg:text-xl xl:text-xl 2xl:text-2xl 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl font-semibold mb-3 sm:mb-4 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-7 3xl:mb-8 4xl:mb-10 5xl:mb-12">Dịch vụ</h4>
            <ul className="space-y-2">
              <li><a href="#dealer-management" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300">Quản lý đại lý</a></li>
              <li><a href="#inventory" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300">Quản lý kho</a></li>
              <li><a href="#sales" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300">Báo cáo bán hàng</a></li>
              <li><a href="#training" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300">Đào tạo</a></li>
            </ul>
          </div>

          {/* Social & Legal */}
          <div className="text-center md:text-left">
            <h4 className="text-slate-900 dark:text-slate-100 text-lg font-semibold mb-4">Theo dõi chúng tôi</h4>
            <div className="flex flex-col gap-2 mb-5 items-center md:items-start">
              <a href="#facebook" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 flex items-center gap-2">📘 Facebook</a>
              <a href="#youtube" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 flex items-center gap-2">📹 YouTube</a>
              <a href="#linkedin" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 flex items-center gap-2">💼 LinkedIn</a>
            </div>
            <div className="flex flex-col gap-2 items-center md:items-start">
              <a href="#privacy" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 text-sm transition-colors duration-300">Chính sách bảo mật</a>
              <a href="#terms" className="text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 text-sm transition-colors duration-300">Điều khoản sử dụng</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-5 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-center md:text-left">
            <p className="text-slate-500 dark:text-slate-400 text-sm">&copy; {currentYear} TuneZone Dealer. Tất cả quyền được bảo lưu.</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm opacity-70">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;