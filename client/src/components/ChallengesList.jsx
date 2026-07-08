import React, { useState, useEffect } from 'react';

export default function ChallengesList() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/challenges')
      .then((response) => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setChallenges(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('No se pudo conectar con el servidor. El servicio no está disponible temporalmente.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '20px', color: '#ef6c00', fontWeight: 'bold' }}> Cargando retos desde el servidor...</div>;
  if (error) return <div style={{ padding: '20px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '6px', border: '1px solid #ef9a9a', margin: '10px 0', fontWeight: 'bold' }}>⚠️ {error}</div>;

  return (
    <div style={{ fontFamily: 'sans-serif', marginTop: '20px' }}>
      <h2 style={{ color: '#0056b3' }}>Lista de Retos Disponibles</h2>
      <div style={{ display: 'grid', gap: '15px' }}>
        {challenges.map((challenge) => (
          <div key={challenge.id} style={{ border: '1px solid #e0e0e0', padding: '15px', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{challenge.title} <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '12px', backgroundColor: '#fff3e0', color: '#ef6c00' }}>{challenge.difficulty}</span></h3>
            <p style={{ color: '#555', margin: 0 }}>{challenge.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}