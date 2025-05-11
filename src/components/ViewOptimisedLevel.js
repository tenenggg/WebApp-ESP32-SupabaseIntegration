import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTint } from 'react-icons/fa';
import ReactSpeedometer from 'react-d3-speedometer';

function ViewOptimisedLevel() {
  const navigate = useNavigate();

  const optimisedLevels = [
    { plant: 'Bok Choy', ec: 2.0, ph: 6.5 },
    { plant: 'Scallion', ec: 2.05, ph: 6.25 },
    { plant: 'Lettuce', ec: 1.0, ph: 5.75 },
    { plant: 'Spinach', ec: 2.05, ph: 6.5 },
    { plant: 'Broccoli', ec: 3.15, ph: 6.4 }
  ];

  return (
    <div className="p-4 bg-green-100 min-h-screen">
      <div className="mb-4 p-4 bg-white shadow rounded text-center">
        <h1 className="text-6xl font-bold mb-4 text-green-700">View Optimised Level</h1>
        <div className="grid grid-cols-1 gap-2">
          {optimisedLevels.map((item, index) => (
            <div key={index} className="p-1 bg-green-200 rounded shadow flex items-center justify-between">
              <div className="flex items-center">
                <FaTint className="text-2xl mr-1 text-green-700" />
                <h2 className="text-4xl font-bold text-green-700">{item.plant}</h2> {/* Increased font size */}
              </div>
              <div className="flex justify-around w-full mt-6">
                <div className="flex flex-col items-center w-24 mx-auto">
                  <h3 className="text-lg font-bold text-green-700 mb-1">pH Level</h3>
                  <ReactSpeedometer
                    maxValue={14}
                    value={item.ph}
                    needleColor="black"
                    startColor="green"
                    endColor="red"
                    textColor="green"
                    segments={10}
                    currentValueText={`${item.ph}`}
                    textStyle={{ fontSize: '12px' }}
                  />
                </div>
                <div className="flex flex-col items-center w-24 mx-auto">
                  <h3 className="text-lg font-bold text-green-700 mb-1">EC</h3>
                  <ReactSpeedometer
                    maxValue={10}
                    value={item.ec}
                    needleColor="black"
                    startColor="green"
                    endColor="red"
                    textColor="green"
                    segments={10}
                    currentValueText={`${item.ec} mS/cm`}
                    textStyle={{ fontSize: '12px' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 px-6 py-3 bg-green-500 text-white rounded text-2xl" onClick={() => navigate("/")}>GO HOMEPAGE</button>
      </div>
    </div>
  );
}

export default ViewOptimisedLevel;
