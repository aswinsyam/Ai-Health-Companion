import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:8000/api';

function App() {
  // Symptom checker state
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);

  // Diabetes predictor state
  const [predForm, setPredForm] = useState({
    age: '',
    blood_pressure: '',
    cholesterol: '',
    glucose: '',
    smoker: 0,
    bmi: ''
  });
  const [predResult, setPredResult] = useState(null);
  const [predLoading, setPredLoading] = useState(false);

  // Analyze Symptoms
  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      alert('Please enter symptoms');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/ai-check`, {
        user_id: 1,
        symptoms: symptoms
      });
      setResult(response.data.analysis);
    } catch (error) {
      alert('Error connecting to server. Is backend running? (cd backend && uvicorn app.main:app --reload)');
    }
    setLoading(false);
  };

  // Diabetes Prediction
  const handlePredict = async () => {
    // Parse with validation to prevent NaN/null in JSON
    const data = {
      user_id: 1,
      age: isNaN(parseInt(predForm.age)) ? 0 : parseInt(predForm.age),
      blood_pressure: isNaN(parseInt(predForm.blood_pressure)) ? 0 : parseInt(predForm.blood_pressure),
      cholesterol: isNaN(parseInt(predForm.cholesterol)) ? 0 : parseInt(predForm.cholesterol),
      glucose: isNaN(parseInt(predForm.glucose)) ? 0 : parseInt(predForm.glucose),
      smoker: isNaN(parseInt(predForm.smoker)) ? 0 : parseInt(predForm.smoker),
      bmi: isNaN(parseFloat(predForm.bmi)) ? 0.0 : parseFloat(predForm.bmi)
    };

    // Enhanced validation
    if (data.age === 0 || data.blood_pressure === 0 || data.cholesterol === 0 || 
        data.glucose === 0 || data.bmi === 0.0 || data.age < 0 || data.bmi < 0) {
      alert('Please fill all fields with valid numbers (age > 0, bmi > 0)');
      return;
    }

    console.log('Sending payload:', JSON.stringify(data)); // Debug exact JSON

    setPredLoading(true);
    try {
      const response = await axios.post(`${API_URL}/disease-predict`, data);
      setPredResult(response.data.prediction);
    } catch (error) {
      alert('Prediction error. Check console for details.');
      console.error('Full error:', error.response?.data || error.message);
    }
    setPredLoading(false);
  };

  // Get Health Records
  const handleGetRecords = async () => {
    try {
      const response = await axios.get(`${API_URL}/health-records/1`);
      setRecords(response.data);
    } catch (error) {
      alert('Error fetching records');
    }
  };

  return (
    <div className="App" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div className="container">
        <h1>🏥 HealthAI Companion</h1>
        <p className="subtitle">AI-Powered Healthcare Assistant</p>

        {/* Symptom Checker */}
        <div className="card">
          <h2>🔍 Symptom Checker</h2>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe your symptoms (e.g., chest pain, fever, fatigue)..."
            rows="4"
          />
          <button onClick={handleAnalyze} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Symptoms'}
          </button>
        </div>

        {/* Symptom Result */}
        {result && (
          <div className={`card result ${result.risk === 'High' ? 'high-risk' : result.risk === 'Medium' ? 'medium-risk' : 'low-risk'}`}>
            <h2>📊 Analysis Result</h2>
            <div className="risk-badge">{result.risk}</div>
            <p className="recommendation">{result.recommendation}</p>
          </div>
        )}

        {/* Diabetes Risk Calculator */}
        <div className="card">
          <h2>🩸 Diabetes Risk Calculator</h2>
          <div className="form-grid">
            <input
              type="number"
              placeholder="Age"
              value={predForm.age}
              onChange={(e) => setPredForm({...predForm, age: e.target.value})}
            />
            <input
              type="number"
              placeholder="Blood Pressure (mmHg)"
              value={predForm.blood_pressure}
              onChange={(e) => setPredForm({...predForm, blood_pressure: e.target.value})}
            />
            <input
              type="number"
              placeholder="Cholesterol (mg/dL)"
              value={predForm.cholesterol}
              onChange={(e) => setPredForm({...predForm, cholesterol: e.target.value})}
            />
            <input
              type="number"
              placeholder="Glucose (mg/dL)"
              value={predForm.glucose}
              onChange={(e) => setPredForm({...predForm, glucose: e.target.value})}
            />
            <select
              value={predForm.smoker}
              onChange={(e) => setPredForm({...predForm, smoker: e.target.value})}
            >
              <option value={0}>Non-Smoker</option>
              <option value={1}>Smoker</option>
            </select>
            <input
              type="number"
              step="0.1"
              placeholder="BMI"
              value={predForm.bmi}
              onChange={(e) => setPredForm({...predForm, bmi: e.target.value})}
            />
          </div>
          <button onClick={handlePredict} disabled={predLoading}>
            {predLoading ? 'Predicting...' : 'Calculate Risk'}
          </button>
        </div>

        {/* Prediction Result */}
        {predResult && (
          <div className={`card result ${predResult.risk === 'High' ? 'high-risk' : 'low-risk'}`}>
            <h2>📈 Prediction Result</h2>
            <div className="risk-badge">{predResult.risk}</div>
            <p><strong>Confidence:</strong> {predResult.confidence}</p>
            <p>No Diabetes: {(predResult.probability['No Diabetes']*100).toFixed(1)}%</p>
            <p>Diabetes: {(predResult.probability['Diabetes']*100).toFixed(1)}%</p>
          </div>
        )}

        {/* Health Records */}
        <div className="card">
          <h2>📋 Health Records</h2>
          <button onClick={handleGetRecords}>Load My Records</button>
          {records.length > 0 ? (
            <div className="records-list">
              {records.map((r) => (
                <div key={r.id} className="record-item">
                  <span>{r.risk_level} Risk ({r.confidence}%)</span>
                  <small>{new Date(r.created_at).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          ) : records.message && <p>{records.message}</p>}
        </div>

        {/* Quick Symptoms */}
        <div className="card">
          <h2>⚡ Quick Test</h2>
          <div className="quick-buttons">
            <button onClick={() => setSymptoms('chest pain')}>Chest Pain</button>
            <button onClick={() => setSymptoms('fever and cough')}>Fever + Cough</button>
            <button onClick={() => setSymptoms('fatigue')}>Fatigue</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

