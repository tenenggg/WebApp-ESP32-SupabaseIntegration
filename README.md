# 🌿 IoT-Enabled Hydroponic Monitoring System

This is a smart hydroponic system that simulates the monitoring of plant growing conditions using an **ESP32 microcontroller**, a **ReactJS dashboard**, and **Supabase** as the backend. It sends **random dummy data** from ESP32 to Supabase to mimic sensor readings like water temperature, pH, and EC values.

---

## 📡 System Overview

### 🧠 Components
- **ESP32 (Arduino C++)**: Sends simulated environmental data to Supabase.
- **Supabase**: Backend for storing plant configurations and sensor data.
- **ReactJS + Tailwind CSS**: Frontend dashboard to view and manage data.

---

## 🚀 ESP32 Firmware Features

- Connects to Wi-Fi and Supabase.
- Generates **random dummy values** for:
  - **Water Temperature**: 20.0°C – 30.0°C
  - **pH**: 5.0 – 8.0
  - **EC (Electrical Conductivity)**: 1.0 – 2.5 mS/cm
- Reads `selected_plant_id` from `system_config`.
- Fetches plant profile from `plant_profiles` table.
- Compares data against profile thresholds:
  - Triggers virtual "pump" messages based on out-of-range values.
- Inserts data into:
  - `sensor_data` (global log)
  - `<plant_name>_data` (specific log per plant)

📋 **Note**: No physical sensors or relays are connected — all data is **randomly generated** for simulation/testing.

---

## 🖥️ ReactJS Frontend

Built with:
- **ReactJS**
- **Tailwind CSS**
- **Supabase JS Client**

### Features:
- Displays the latest environmental data from Supabase.
- Allows the user to select/change the active plant profile (`selected_plant_id`).
- UI styled using Tailwind CSS for clarity and responsiveness.

---

## 🗂️ Supabase Tables Structure

### `system_config`
| Column            | Type    | Description             |
|-------------------|---------|-------------------------|
| selected_plant_id | UUID/ID | Active plant profile ID |

### `plant_profiles`
| Column  | Type  | Description                |
|---------|-------|----------------------------|
| id      | UUID  | Unique plant profile ID    |
| name    | TEXT  | Plant name                 |
| ph_min  | FLOAT | Minimum acceptable pH      |
| ph_max  | FLOAT | Maximum acceptable pH      |
| ec_min  | FLOAT | Minimum EC level           |
| ec_max  | FLOAT | Maximum EC level           |

### `sensor_data`
| Column           | Type    |
|------------------|---------|
| water_temperature| FLOAT   |
| ph               | FLOAT   |
| ec               | FLOAT   |
| timestamp        | TIMESTAMP (auto-generated) |

### `<plant_name>_data`
Same structure as `sensor_data`, but specific to each plant (e.g., `Spinach_data`, `Lettuce_data`).

---

## ⚙️ Setup Instructions

### ESP32 Firmware
1. Use Arduino IDE with ESP32 board support.
2. Install required libraries:
   - `WiFi.h`
   - `HTTPClient.h`
   - `ArduinoJson.h`
   - Custom: `ESPSupabase.h`
3. Upload the firmware and open the Serial Monitor at 115200 baud.
4. Monitor simulated readings and insertion logs.

### ReactJS Frontend
1. Clone the frontend repo and install dependencies:
   ```bash
   npm install
   npm run dev
   ```
2. Add your `.env` file:
   ```env
   VITE_SUPABASE_URL=https://<your-project>.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

---

## 🧪 Simulated Pump Logic

```plaintext
If pH < min  → Pump 1 ON (Base)
If pH > max  → Pump 2 ON (Acid)
If EC < min  → Pump 3 ON (Nutrients)
If EC > max  → Pump 4 ON (Dilution)
```

These are printed in the Serial Monitor only for demonstration.

---

## 📌 Notes

- All sensor data is **simulated with `random()`** for demonstration.
- No physical pumps, sensors, or relays are currently connected.
- Designed for testing the database flow and frontend/backend integration.

---

## 📈 Future Enhancements

- Integrate real pH and EC sensors.
- Add relay controls for automated nutrient/pH dosing.
- Add real-time charts and mobile responsiveness.
- Push notifications or alerts for out-of-range conditions.

---

## 🛠️ Built With

- [ESP32](https://www.espressif.com/en/products/socs/esp32)
- [Supabase](https://supabase.com/)
- [ReactJS](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📬 Contact

For questions or improvements, feel free to reach out!
