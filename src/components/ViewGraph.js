import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';

function ViewGraph() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [plantName, setPlantName] = useState('');
  const [loading, setLoading] = useState(true);

  const getSelectedPlantData = useCallback(async () => {
    try {
      // 1. Get selected plant ID from system_config
      const { data: configData, error: configError } = await supabase
        .from('system_config')
        .select('selected_plant_id')
        .limit(1)
        .single();

      if (configError || !configData) {
        console.error('Error fetching selected plant ID:', configError);
        return;
      }

      const selectedPlantId = configData.selected_plant_id;

      // 2. Get plant name using ID (only fetch if plantName is not already set)
      let fetchedPlantName = plantName;
      if (!plantName) {
        const { data: profileData, error: profileError } = await supabase
          .from('plant_profiles')
          .select('name')
          .eq('id', selectedPlantId)
          .single();

        if (profileError || !profileData) {
          console.error('Error fetching plant name:', profileError);
          return;
        }

        fetchedPlantName = profileData.name;
        setPlantName(fetchedPlantName);
      }

      // 3. Construct table name (e.g., "Spinach_data")
      const tableName = `${fetchedPlantName}_data`;

      // 4. Get data from that plant’s data table
      const { data: sensorData, error: dataError } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: true });

      if (dataError) {
        console.error(`Error fetching data from ${tableName}:`, dataError);
        return;
      }

      setChartData(sensorData);
      setLoading(false);
    } catch (error) {
      console.error('Error updating graph data:', error);
    }
  }, [plantName]);

  useEffect(() => {
    getSelectedPlantData(); // fetch on mount

    const interval = setInterval(() => {
      getSelectedPlantData(); // fetch every 3 seconds
    }, 3000);

    return () => clearInterval(interval); // cleanup
  }, [getSelectedPlantData]); // Added getSelectedPlantData as a dependency

  const limitedChartData = chartData.slice(-15); // latest 15 entries

  const commonOptions = {
    chart: { id: 'sensor-data', toolbar: { show: false } },
    xaxis: {
      categories: limitedChartData.map(d => new Date(d.created_at).toLocaleTimeString()),
    },
  };

  return (
    <div className="p-4 bg-green-100 min-h-screen">
      <div className="mb-4 p-4 bg-white shadow rounded text-center">
        <h1 className="text-6xl font-bold mb-4 text-green-700">View Graph</h1>
        <h2 className="text-2xl mb-4 text-gray-600">{plantName ? `Plant: ${plantName}` : 'Loading...'}</h2>

        {loading ? (
          <p className="text-lg text-gray-500">Fetching data...</p>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2 text-green-700">Temperature (°C)</h2>
              <Chart
                options={commonOptions}
                series={[{ name: 'Temperature (°C)', data: limitedChartData.map(d => d.water_temperature) }]}
                type="line"
                width="100%"
                height="400"
              />
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2 text-green-700">pH</h2>
              <Chart
                options={commonOptions}
                series={[{ name: 'pH', data: limitedChartData.map(d => d.ph) }]}
                type="line"
                width="100%"
                height="400"
              />
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2 text-green-700">EC (mS/cm)</h2>
              <Chart
                options={commonOptions}
                series={[{ name: 'EC (mS/cm)', data: limitedChartData.map(d => d.ec) }]}
                type="line"
                width="100%"
                height="400"
              />
            </div>
          </>
        )}

        <button className="mt-4 px-6 py-3 bg-green-500 text-white rounded text-2xl" onClick={() => navigate("/")}>
          GO HOMEPAGE
        </button>
      </div>
    </div>
  );
}

export default ViewGraph;
