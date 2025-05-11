#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ESPSupabase.h>

const char* ssid = "AGD_2.4GHz";
const char* password = "AfifGD10";
const char* supabaseUrl = "https://nshoxougnzhvtxvyyskq.supabase.co";
const char* supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zaG94b3VnbnpodnR4dnl5c2txIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MDAzOTAsImV4cCI6MjA1Nzk3NjM5MH0.bktULAQH8aTFeW9TVUWbW-XyLOEn1VV0befxl9Mnonk";

Supabase supabase;

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to Wi-Fi...");
  }
  Serial.println("Wi-Fi connected!");

  supabase.begin(supabaseUrl, supabaseKey);
  randomSeed(analogRead(0));
}

void loop() {
  float waterTemp = random(200, 300) / 10.0; // 20.0 to 30.0 °C
  float ph = random(50, 80) / 10.0;          // 5.0 to 8.0
  float ec = random(10, 25) / 10.0;          // 1.0 to 2.5 mS/cm

  Serial.print("Reading -> Temp: ");
  Serial.print(waterTemp);
  Serial.print(" °C, pH: ");
  Serial.print(ph);
  Serial.print(", EC: ");
  Serial.println(ec);

  // === Step 1: Get selected plant ID from system_config ===
  HTTPClient http;
  http.begin("https://nshoxougnzhvtxvyyskq.supabase.co/rest/v1/system_config?select=selected_plant_id&limit=1");
  http.addHeader("apikey", supabaseKey);
  http.addHeader("Authorization", "Bearer " + String(supabaseKey));
  int httpCode = http.GET();

  String selectedPlantId = "";
  if (httpCode == 200) {
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, http.getString());
    if (doc.size() > 0) {
      selectedPlantId = String((const char*)doc[0]["selected_plant_id"]);
    }
  }
  http.end();

  if (selectedPlantId == "") {
    Serial.println("Could not retrieve selected plant ID.");
    delay(5000);
    return;
  }

  // === Step 2: Fetch plant profile using selectedPlantId ===
  http.begin("https://nshoxougnzhvtxvyyskq.supabase.co/rest/v1/plant_profiles?id=eq." + selectedPlantId + "&select=name,ph_min,ph_max,ec_min,ec_max");
  http.addHeader("apikey", supabaseKey);
  http.addHeader("Authorization", "Bearer " + String(supabaseKey));
  httpCode = http.GET();

  if (httpCode == 200) {
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, http.getString());

    String plantName = doc[0]["name"];
    float phMin = doc[0]["ph_min"];
    float phMax = doc[0]["ph_max"];
    float ecMin = doc[0]["ec_min"];
    float ecMax = doc[0]["ec_max"];

    // === Step 3: Build table name (no lowercasing!) ===
    String tableName = plantName + "_data";  // e.g., "Spinach_data"

    // === Step 4: Create JSON payload ===
    String jsonData = "{\"water_temperature\": " + String(waterTemp, 1) +
                      ", \"ph\": " + String(ph, 1) +
                      ", \"ec\": " + String(ec, 1) + "}";

    // === Step 5: Insert into Supabase ===
    // === Insert into plant-specific table ===
int response = supabase.insert(tableName, jsonData, false);
if (response == 200 || response == 201) {
  Serial.println("✅ Data inserted into " + tableName);
} else {
  Serial.print("❌ Failed to insert into plant table. HTTP response: ");
  Serial.println(response);
}

// === Insert into central 'sensor_data' table ===
int response2 = supabase.insert("sensor_data", jsonData, false);
if (response2 == 200 || response2 == 201) {
  Serial.println("✅ Data also inserted into sensor_data");
} else {
  Serial.print("❌ Failed to insert into sensor_data. HTTP response: ");
  Serial.println(response2);
}


    // === Step 6: Logic for pump control ===
    bool phLow = ph < phMin;
    bool phHigh = ph > phMax;
    bool ecLow = ec < ecMin;
    bool ecHigh = ec > ecMax;

    Serial.printf("Selected Plant: %s\n", plantName.c_str());
    Serial.printf("Profile: pH [%.1f - %.1f], EC [%.1f - %.1f]\n", phMin, phMax, ecMin, ecMax);

    if (phLow)  Serial.println("Pump 1 ON - pH too LOW");
    if (phHigh) Serial.println("Pump 2 ON - pH too HIGH");
    if (ecLow)  Serial.println("Pump 3 ON - EC too LOW");
    if (ecHigh) Serial.println("Pump 4 ON - EC too HIGH");

  } else {
    Serial.print("❌ Failed to fetch plant profile. HTTP Code: ");
    Serial.println(httpCode);
  }

  http.end();
  delay(3000);
}
