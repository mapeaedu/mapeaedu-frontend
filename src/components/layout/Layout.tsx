import React, { useState } from 'react';
import Header, { HeaderProps } from './Header';
import Sidebar, { SidebarProps } from './Sidebar';

export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  headerProps?: Omit<HeaderProps, 'onMenuToggle' | 'title'>;
  sidebarProps?: Omit<SidebarProps, 'isOpen' | 'onClose'>;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  headerProps = {},
  sidebarProps = {},
}) => {
  // State for mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Close sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        title={title} 
        onMenuToggle={toggleSidebar} 
        {...headerProps} 
      />
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
        {...sidebarProps} 
      />
      
      {/* Main content */}
      <div className="md:pl-64">
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;