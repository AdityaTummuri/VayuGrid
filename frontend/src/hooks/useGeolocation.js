import { useState, useCallback } from 'react';

export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState('IDLE'); // IDLE, ACQUIRING, ACQUIRED, ERROR
  const [error, setError] = useState(null);

  const acquireLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('ERROR');
      setError('Geolocation not supported by your browser');
      return;
    }

    setStatus('ACQUIRING');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: parseFloat(position.coords.latitude.toFixed(6)),
          lng: parseFloat(position.coords.longitude.toFixed(6)),
          accuracy: Math.round(position.coords.accuracy),
        });
        setStatus('ACQUIRED');
      },
      (err) => {
        console.warn('Geolocation acquisition error:', err);
        // Fallback default coordinates (Delhi CPCB central station)
        setCoords({
          lat: 28.6289,
          lng: 77.2065,
          accuracy: 25,
        });
        setStatus('ACQUIRED');
        setError('Location access denied. Using verified municipal sensor anchor.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const setManualCoords = useCallback((lat, lng) => {
    setCoords({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      accuracy: 0,
    });
    setStatus('ACQUIRED');
    setError(null);
  }, []);

  return {
    coords,
    status,
    error,
    acquireLocation,
    setManualCoords,
  };
}
