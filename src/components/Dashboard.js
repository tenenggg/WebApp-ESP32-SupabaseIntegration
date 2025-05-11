import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLeaf, FaFlask, FaChartLine, FaClock } from 'react-icons/fa';

function Dashboard() {
  const navigate = useNavigate();
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-green-900 text-white flex flex-col items-center">
      {/* Header */}
      <div className="h-48 flex items-center justify-center">
        <div className="bg-green-700 bg-opacity-90 px-8 py-3 rounded-lg">
          <h1 className="text-6xl font-bold">Hydroponic Monitoring</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-row items-start justify-center px-16 py-12 gap-40 mt-48">
        {/* 2x2 Grid for Widgets */}
        <div className="grid grid-cols-2 gap-10">
          <div onClick={() => navigate("/view-data")} className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform">
            <FaLeaf size={80} /> {/* Increased icon size */}
            <p className="mt-2 underline text-xl">View Data</p>
          </div>
          <div onClick={() => navigate("/view-optimised-level")} className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform">
            <FaFlask size={80} /> {/* Increased icon size */}
            <p className="mt-2 underline text-xl">Optimized Level</p>
          </div>
          <div onClick={() => navigate("/view-graph")} className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform">
            <FaChartLine size={80} /> {/* Increased icon size */}
            <p className="mt-2 underline text-xl">View Graph</p>
          </div>
          <div onClick={() => navigate("/select-plant")} className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform">
            <FaLeaf size={80} /> {/* Increased icon size */}
            <p className="mt-2 underline text-xl">Select Plant</p>
          </div>
        </div>

        {/* Clock Widget */}
        <div className="flex flex-col items-center border-4 border-white rounded-2xl p-6">
          <FaClock size={100} /> {/* Increased clock icon size */}
          <p className="mt-4 text-4xl">{currentTime}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
