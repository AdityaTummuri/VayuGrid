import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CITIES, DEFAULT_CITY } from '../constants/cities';
import { fetchCities, fetchActiveIncidents, fetchWeatherTelemetry, dispatchIncidentAction } from '../api/vayugridApi';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [cities, setCities] = useState(CITIES);
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY);
  const [incidents, setIncidents] = useState([]);
  const [activeIncident, setActiveIncident] = useState(null);
  const [weather, setWeather] = useState(null);
  const [isLoadingIncidents, setIsLoadingIncidents] = useState(false);
  const [toast, setToast] = useState(null);
  const [istTime, setIstTime] = useState('');

  // Live IST Clock update every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const istString = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setIstTime(`${istString} IST`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Show Toast
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, duration);
  }, []);

  // Initial load of cities
  useEffect(() => {
    let mounted = true;
    fetchCities().then(data => {
      if (mounted && data?.length) setCities(data);
    });
    return () => { mounted = false; };
  }, []);

  // Load incidents and weather when selectedCity changes
  const loadCityData = useCallback(async (city) => {
    if (!city) return;
    setIsLoadingIncidents(true);
    try {
      const [incidentList, weatherData] = await Promise.all([
        fetchActiveIncidents(city.id),
        fetchWeatherTelemetry(city.center.lat, city.center.lng),
      ]);
      setIncidents(incidentList);
      setWeather(weatherData);
      if (incidentList.length > 0) {
        setActiveIncident(incidentList[0]);
      } else {
        setActiveIncident(null);
      }
    } catch (err) {
      console.error('Error fetching city telemetry:', err);
      showToast('Telemetry refresh failed. Showing cached data.', 'warning');
    } finally {
      setIsLoadingIncidents(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadCityData(selectedCity);
  }, [selectedCity, loadCityData]);

  // Handle City Change
  const handleSelectCity = useCallback((cityId) => {
    const found = cities.find(c => c.id === cityId);
    if (found) {
      setSelectedCity(found);
    }
  }, [cities]);

  // Dispatch Action for an incident
  const handleDispatchAction = useCallback(async (ticketId, actionPayload) => {
    try {
      const result = await dispatchIncidentAction(ticketId, actionPayload);
      if (result.success || result.status === 'DISPATCHED') {
        // Update local state
        setIncidents(prev => prev.map(inc => {
          if (inc.ticket_id === ticketId) {
            return { ...inc, status: 'DISPATCHED' };
          }
          return inc;
        }));
        if (activeIncident?.ticket_id === ticketId) {
          setActiveIncident(prev => ({ ...prev, status: 'DISPATCHED' }));
        }
        showToast(`Asset Dispatched: ${result.asset_callsign || 'Anti-Smog Unit'} (ETA: ${result.eta_minutes || 12}m)`, 'success');
        return true;
      }
      return false;
    } catch (err) {
      showToast('Dispatch failed: ' + err.message, 'error');
      return false;
    }
  }, [activeIncident, showToast]);

  const value = {
    cities,
    selectedCity,
    setSelectedCity: handleSelectCity,
    incidents,
    activeIncident,
    setActiveIncident,
    weather,
    isLoadingIncidents,
    refreshIncidents: () => loadCityData(selectedCity),
    dispatchAction: handleDispatchAction,
    toast,
    showToast,
    clearToast: () => setToast(null),
    istTime,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
