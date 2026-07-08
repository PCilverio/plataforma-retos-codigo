import React, { useState, useEffect } from 'react';

export default function ChallengesList() {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [codeAnswer, setCodeAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/challenges')
      .then((response) => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setChallenges(data);
        if (data.length > 0) setSelectedChallenge(data[0]);
        setLoading(false);
      })
      .catch((err) => {
        setError('No se pudo conectar con el servidor. El servicio no está disponible temporalmente.');
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmissionResult(null);

    fetch('http://localhost:3000/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        challengeId: selectedChallenge.id, 
        code: codeAnswer 
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al procesar el envío');
        return res.json();
      })
      .then((data) => {
        setSubmissionResult(data);
        setCodeAnswer('');
      })
      .catch((err) => {
        alert('Error de red: El servidor se desconectó inesperadamente.');
      });
  };

  if (loading) return <div style={{ padding: '20px', color: '#0056b3', fontWeight: 'bold' }}>⏳ Cargando retos desde el servidor...</div>;
  if (error && challenges.length === 0) return <div style={{ padding: '20px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '6px', border: '1px solid #ef9a9a', fontWeight: 'bold' }}>⚠️ {error}</div>;

  return (
    <div style={{ display: 'flex', gap: '25px', marginTop: '20px', fontFamily: 'sans-serif' }}>
      
      <div style={{ width: '35%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ color: '#0056b3', margin: '0 0 5px 0' }}>Retos</h3>
        {challenges.map((challenge) => (
          <div 
            key={challenge.id} 
            onClick={() => { setSelectedChallenge(challenge); setSubmissionResult(null); }}
            style={{
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              cursor: 'pointer',
              backgroundColor: selectedChallenge?.id === challenge.id ? '#e3f2fd' : '#fff',
              borderLeft: selectedChallenge?.id === challenge.id ? '5px solid #0056b3' : '1px solid #e0e0e0',
              transition: 'all 0.2s ease'
            }}
          >
            <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{challenge.title}</h4>
            <span style={{ 
              fontSize: '11px', 
              padding: '2px 6px', 
              borderRadius: '8px', 
              backgroundColor: challenge.difficulty === 'Fácil' ? '#e8f5e9' : '#fff3e0', 
              color: challenge.difficulty === 'Fácil' ? '#2e7d32' : '#ef6c00',
              fontWeight: 'bold'
            }}>
              {challenge.difficulty}
            </span>
          </div>
        ))}
      </div>

      <div style={{ width: '65%', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
        {selectedChallenge ? (
          <div>
            <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: selectedChallenge.difficulty === 'Fácil' ? '#2e7d32' : '#ef6c00' }}>
              {selectedChallenge.difficulty}
            </span>
            <h2 style={{ margin: '5px 0 10px 0', color: '#212529' }}>{selectedChallenge.title}</h2>
            <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '20px' }}>{selectedChallenge.description}</p>
            
            <div style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '12px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '13px', marginBottom: '20px' }}>
              // {selectedChallenge.title}
            </div>

            {submissionResult && (
              <div style={{ 
                padding: '12px', 
                borderRadius: '6px', 
                marginBottom: '15px', 
                fontWeight: 'bold',
                backgroundColor: submissionResult.status === 'Aceptado' ? '#e8f5e9' : '#ffebee', 
                color: submissionResult.status === 'Aceptado' ? '#2e7d32' : '#c62828',
                border: `1px solid ${submissionResult.status === 'Aceptado' ? '#a5d6a7' : '#ef9a9a'}`
              }}>
                {submissionResult.status === 'Aceptado' ? '✅ ¡Respuesta Aceptada!' : '❌ Respuesta Incorrecta (Falta la palabra return)'}
                <span style={{ display: 'block', fontSize: '11px', fontWeight: 'normal', marginTop: '4px', color: '#666' }}>ID Envío: {submissionResult.id}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Tu respuesta</label>
              <textarea 
                rows="4"
                value={codeAnswer}
                onChange={(e) => setCodeAnswer(e.target.value)}
                placeholder="Escribe tu código o salida esperada aquí..."
                required
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontFamily: 'monospace', fontSize: '13px', boxSizing: 'border-box', marginBottom: '15px', resize: 'vertical' }}
              />
              <button 
                type="submit" 
                style={{ width: '100%', padding: '12px', background: '#0056b3', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
              >
                Enviar respuesta
              </button>
            </form>
          </div>
        ) : (
          <p style={{ color: '#777' }}>Selecciona un reto de la lista para comenzar.</p>
        )}
      </div>

    </div>
  );
}