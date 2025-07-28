import React from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

export interface SidebarLink {
    href: string;
    label: string;
    icon?: React.ReactNode;
}

export interface SidebarProps {
    isOpen: boolean;
    onClose?: () => void;
    links?: SidebarLink[];
}

const defaultLinks: SidebarLink[] = [
    {
        href: '/rubrics',
        label: 'Rubrics',
        icon: (
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
        ),
    }
];

const Sidebar: React.FC<SidebarProps> = ({
                                             isOpen,
                                             onClose,
                                             links = defaultLinks
                                         }) => {
    const pathname = usePathname();

    // Determine if a link is active
    const isActive = (href: string) => {
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <>
            {/* Mobile sidebar backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 md:hidden"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Sidebar header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Navigation</h2>
                    {onClose && (
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
                            onClick={onClose}
                            aria-label="Close menu"
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Sidebar content */}
                <nav className="mt-4 px-2 space-y-1">
                    {links.map((link) => {
                        const active = isActive(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                    active
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                                onClick={onClose}
                            >
                                {link.icon && (
                                    <span
                                        className={`mr-3 ${active ? 'text-blue-500' : 'text-gray-500 group-hover:text-gray-500'}`}>
                    {link.icon}
                  </span>
                                )}
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;