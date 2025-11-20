import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL || 'https://deployment-and-devops-essentials-ebk0.onrender.com'

function App() {
  const [backendStatus, setBackendStatus] = useState('checking...')
  const [apiResponse, setApiResponse] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkBackendConnection()
  }, [])

  const checkBackendConnection = async () => {
    try {
      const response = await axios.get(`${API_BASE}/health`)
      setBackendStatus('✅ Connected')
    } catch (error) {
      setBackendStatus('❌ Disconnected')
    }
  }

  const testEndpoint = async (endpoint) => {
    setLoading(true)
    setApiResponse(null)
    try {
      const response = await axios.get(`${API_BASE}${endpoint}`)
      setApiResponse({
        success: true,
        endpoint: endpoint,
        data: response.data
      })
    } catch (error) {
      setApiResponse({
        success: false,
        endpoint: endpoint,
        error: error.message
      })
    }
    setLoading(false)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🌱 AgriSmart</h1>
        <p>Smart Farming Solution - React Frontend</p>
        <p>Backend Status: <strong>{backendStatus}</strong></p>
      </header>

      <div className="agri-features">
        <div className="feature-card">
          <h3>👨‍🌾 Farmer Management</h3>
          <p>Manage agricultural data efficiently</p>
        </div>
        <div className="feature-card">
          <h3>🌾 Crop Monitoring</h3>
          <p>Track crop health and growth</p>
        </div>
        <div className="feature-card">
          <h3>📊 Analytics</h3>
          <p>Data-driven farming insights</p>
        </div>
      </div>

      <div className="buttons">
        <button 
          onClick={() => testEndpoint('/')}
          disabled={loading}
        >
          Test Main API
        </button>
        <button 
          onClick={() => testEndpoint('/health')}
          disabled={loading}
        >
          Test Health Check
        </button>
        <button 
          onClick={() => testEndpoint('/api/farmers')}
          disabled={loading}
        >
          Test Farmers API
        </button>
      </div>

      {apiResponse && (
        <div className="api-response">
          <h3>API Response from {apiResponse.endpoint}</h3>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default App
