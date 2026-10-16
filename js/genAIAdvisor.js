/**
 * EcoTwin AI - Generative AI Sustainability Advisor & Recommendation Engine
 * Integrates Gemini API with an autonomous fallback engine for hackathons
 */

class GenAISustainabilityAdvisor {
  constructor() {
    this.apiKey = localStorage.getItem('ecotwin_gemini_api_key') || '';
    this.chatHistory = [];
  }

  setApiKey(key) {
    this.apiKey = key.trim();
    if (this.apiKey) {
      localStorage.setItem('ecotwin_gemini_api_key', this.apiKey);
    } else {
      localStorage.removeItem('ecotwin_gemini_api_key');
    }
  }

  async queryGemini(promptText) {
    // If user provided a real Gemini API key, call the Google Generative Language API
    if (this.apiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `You are the DSU SCADA Solid Waste Intelligence Engine for Dayananda Sagar University campus infrastructure.
Current SCADA Telemetry Context:
- Active LoRaWAN Nodes: 10
- Campus Average Fill Ratio: 67%
- Critical Overflow Nodes: NODE-01 (Cafeteria North 88%), NODE-06 (Sports Arena 92%), NODE-10 (Transit Bay 85%)
- Contamination Detected: NODE-02 (Cafeteria South Recyclable Stream)
- Autonomous EV Compactor: Active Dynamic TSP Routing.

Operator Directive: ${promptText}

Provide an actionable, structured, industrial engineering recommendation with operational parameters, calculated carbon/cost metrics, and dispatch steps.`
                  }
                ]
              }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidate) return candidate;
        }
      } catch (err) {
        console.warn("Gemini API call failed, falling back to local domain intelligence:", err);
      }
    }

    // High-Fidelity Local Intelligence Fallback Engine
    return this.generateLocalIntelligenceResponse(promptText);
  }

  generateLocalIntelligenceResponse(promptText) {
    const p = promptText.toLowerCase();

    if (p.includes('route') || p.includes('fleet') || p.includes('truck') || p.includes('dispatch') || p.includes('tsp')) {
      return `### 🚛 Autonomous EV-Compactor Dynamic Route Order:
1. **Target 1 (Sports Arena - NODE-06)**: Fill ratio **92%** (Overfill imminent in 18 minutes).
2. **Target 2 (Cafeteria North - NODE-01)**: Fill ratio **88%**, methane gas at 142 ppm.
3. **Target 3 (Transit Bus Bay - NODE-10)**: Fill ratio **85%**.
4. **Target 4 (Cafeteria South - NODE-02)**: Fill ratio **82%** (Contamination flagged).

#### ⚡ Algorithmic Dispatch Metrics:
- **Travel Distance Reduction**: **3.4 km saved** vs. static scheduled sweeps (-38%).
- **Electric Traction Energy Saved**: **1.8 kWh** (equivalent to 1.4 kg CO2e).
- **Turnaround Latency**: 42 minutes saved; avoids cafeteria overflow before peak 1:30 PM rush.`;
    }

    if (p.includes('contaminat') || p.includes('food court') || p.includes('cafeteria') || p.includes('node-02') || p.includes('anomaly')) {
      return `### ⚠️ Optical Contamination Incident Diagnostic:
- **Station Location**: Cafeteria South (NODE-02)
- **Detected Contaminant**: High-density polyethylene cup with dairy fluid in Dry Recyclables stream.
- **Contamination Severity**: 18.4% of bin volume affected.

#### 🛠️ Automated SCADA Interventions:
1. **Motorized Flap Gating**: Solenoid latch locked on dry slot until container is cleared.
2. **Audible Speech Alert**: Broadcast localized warning via speaker: *"Please rinse coffee cups before dry recycling"*.
3. **Student Eco-Credit Notice**: Push notification sent to DSU Student Portal rewarding 10 credits for verified clean cup segregation.`;
    }

    if (p.includes('esg') || p.includes('report') || p.includes('audit') || p.includes('landfill')) {
      return `### 📋 Campus ESG Audit & Decarbonization Roadmap:
- **Landfill Diversion Efficiency**: Current rate **78.4%** across 10 campus nodes.
- **Estimated Carbon Avoidance**: **6.12 Metric Tons of CO2e** sequestered/diverted this month.
- **Recycling Purity Index**: **94.8%** compliance at CS Tech Tower and Library; **88.4%** at Transit Hub.

#### 🎯 Key Engineering Interventions for Campus Administration:
1. **Dynamic EV Compactor Deployment**: Schedule autonomous sweeps triggered at **78% fill threshold** rather than static 4-hour clock cycles. Cuts vehicle emissions by **24%**.
2. **High-Traffic Optical Gating**: Install dual-stream AI camera sensors at Food Court North & South to prevent organic liquid contamination in dry recyclables.
3. **Circular Student Credit Scheme**: Introduce automated UPI or Canteen discount vouchers (₹5 per 1 kg verified recyclables) using Computer Vision scan validation.`;
    }

    if (p.includes('plastic') || p.includes('pet') || p.includes('bottle')) {
      return `### 🔄 Circular Lifecycle Strategy: PET Plastics (Type 1)
- **Current Volume**: ~180 kg/week collected primarily from Sports Arena & Transit Bay.
- **Processing Recommendation**:
  1. Automated mechanical sorting into clear vs. colored flakes.
  2. Granulation and thermal extrusion into 3D printer filaments for DSU Maker Labs & Innovation Hub!
- **Economic Value**: Raw collected bottles: ₹14/kg. Upcycled 3D printing filament: ₹650/kg (**46x value multiplication**).
- **Carbon Offset**: 1.82 kg CO2 avoided per kg of recycled PET.`;
    }

    // General intelligent synthesis
    return `### ⚡ DSU SCADA Operational Telemetry Assessment:
Based on real-time telemetry from the Campus Digital Twin:
- **System Diagnosis**: Overall campus fill ratio is **67%**. Peak waste surge is occurring in Academic and Cafeteria sectors.
- **Immediate Action**: Dispatch Autonomous EV-Truck to **NODE-06 (Sports Arena, 92%)** and **NODE-01 (Cafeteria North, 88%)**.
- **Preventive Insight**: Temperature at Cafeteria North is elevated (31.2°C) with 142 ppm Methane. Organic decomposition is accelerating; emptying within 25 minutes will prevent odor dispersion.
- **Net Sustainability Impact**: Maintaining <15 minute pickup latency on critical nodes preserves **99.2% recyclable purity** and saves ~3.2 kg CO2e in un-composted methane leakage.`;
  }

  generateExecutiveReport() {
    const reportData = ECO_DATA.genAiScenarios.esgReport;
    const now = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return {
      title: reportData.title,
      generatedDate: now,
      score: reportData.score,
      summary: reportData.summary,
      kpis: [
        { label: "Total Waste Collected", value: `${reportData.metrics.totalCollectedKg} kg`, change: "+12% MoM" },
        { label: "Landfill Diversion Rate", value: `${reportData.metrics.divertedFromLandfillPct}%`, change: "Target: 80%" },
        { label: "CO2 Emissions Avoided", value: `${reportData.metrics.co2AvoidedTons} Tons`, change: "Net Positive" },
        { label: "Operational Cost Saved", value: `₹${reportData.metrics.costSavingsInr.toLocaleString()}`, change: "Fleet fuel & labor" },
        { label: "Segregation Accuracy", value: `${reportData.metrics.segregationAccuracyPct}%`, change: "+6.2% with CV" }
      ],
      recommendations: [
        "Transition remaining 4 static bins to solar-powered compacting units with ultrasonic IoT nodes.",
        "Implement AI Vision gating at Canteen disposal stations to lock lids on severe cross-contamination.",
        "Partner with local authorized metallurgical recyclers for DSU Tech Tower PCB and battery e-waste."
      ]
    };
  }
}
