import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Educational Theme Fullscreen Background */}
      <div className="educational-bg" aria-hidden="true" />
      <div className="educational-overlay" aria-hidden="true" />

      <Navbar />
      <main className="flex-1 relative z-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
