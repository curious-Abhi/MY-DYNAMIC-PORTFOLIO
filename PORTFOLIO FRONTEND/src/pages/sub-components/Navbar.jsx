import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-xl font-bold">
                    <Link to="/">MyPortfolio</Link>
                </div>
                <div className="hidden md:flex space-x-6">
                    <Link to="/about" className="text-gray-300 hover:text-white">About</Link>
                    <Link to="/skills" className="text-gray-300 hover:text-white">Skills</Link>
                    <Link to="/portfolio" className="text-gray-300 hover:text-white">Project</Link>
                    <Link to="/certificate" className="text-gray-300 hover:text-white">Certificate</Link>
                    <Link to="/myapps" className="text-gray-300 hover:text-white">MyApps</Link>
                    <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
                    
                    
                </div>
                <div className="md:hidden">
                    <button id="menu-btn" className="text-gray-300 hover:text-white focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div id="menu" className="hidden md:hidden">
                <Link to="/about" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">About</Link>
                <Link to="/skills" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">Skills</Link>
                <Link to="/portfolio" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">Portfolio</Link>
                <Link to="/certificate" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">Certificate</Link>
                <Link to="/myapps" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">MyApps</Link>
                
                <Link to="/contact" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">Contact</Link>
    
               
                
            </div>
        </nav>
    );
};

export default Navbar;
