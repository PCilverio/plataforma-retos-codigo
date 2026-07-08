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

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#4f46e5', fontWeight: '600', fontFamily: 'system-ui' }}>⏳ Cargando retos desde el servidor...</div>;
  if (error && challenges.length === 0) return <div style={{ padding: '20px', maxWidth: '600px', margin: '30px auto', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '12px', border: '1px solid #fca5a5', fontWeight: 'bold', fontFamily: 'system-ui', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>⚠️ {error}</div>;

  return (
    <div style={{ display: 'flex', gap: '30px', marginTop: '30px', fontFamily: 'system-ui, sans-serif', maxWidth: '1100px', margin: '20px auto', padding: '0 20px' }}>
      
      {/* SECCIÓN IZQUIERDA: LISTA */}
      <div style={{ width: '35%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ color: '#1e293b', margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.5px' }}>Desafíos Disponibles</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {challenges.map((challenge) => {
            const isSelected = selectedChallenge?.id === challenge.id;
            return (
              <div 
                key={challenge.id} 
                onClick={() => { setSelectedChallenge(challenge); setSubmissionResult(null); }}
                style={{
                  padding: '18px',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#eef2ff' : '#ffffff',
                  border: isSelected ? '2px solid #4f46e5' : '2px solid #f1f5f9',
                  boxShadow: isSelected ? '0 10px 15px -3px rgba(79, 70, 229, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
                  transform: isSelected ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <h4 style={{ margin: '0 0 8px 0', color: isSelected ? '#4f46e5' : '#334155', fontWeight: '600', fontSize: '15px' }}>{challenge.title}</h4>
                <span style={{ 
                  fontSize: '11px', 
                  padding: '4px 10px', 
                  borderRadius: '20px', 
                  backgroundColor: challenge.difficulty === 'Fácil' ? '#dcfce7' : '#ffedd5', 
                  color: challenge.difficulty === 'Fácil' ? '#15803d' : '#b45309',
                  fontWeight: '700'
                }}>
                  {challenge.difficulty}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN DERECHA: DETALLE Y EDITOR */}
      <div style={{ width: '65%', backgroundColor: '#ffffff', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)' }}>
        {selectedChallenge ? (
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: selectedChallenge.difficulty === 'Fácil' ? '#16a34a' : '#ca8a04' }}>
              {selectedChallenge.difficulty}
            </span>
            <h2 style={{ margin: '6px 0 12px 0', color: '#0f172a', fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px' }}>{selectedChallenge.title}</h2>
            <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '24px', fontSize: '15px' }}>{selectedChallenge.description}</p>
            
            {/* Cabecera simulada de editor de código */}
            <div style={{ backgroundColor: '#1e293b', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', padding: '10px 16px', display: 'flex', gap: '6px', alignItems: 'center', borderBottom: '1px solid #334155' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#eab308' }}></div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
              <span style={{ color: '#94a3b8', fontSize: '11px', fontFamily: 'monospace', marginLeft: '10px' }}>solucion.js</span>
            </div>
            <div style={{ background: '#0f172a', color: '#38bdf8', padding: '16px', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', fontFamily: 'JetBrains Mono, Fira Code, monospace', fontSize: '13px', marginBottom: '26px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}>
              <span style={{ color: '#64748b' }}>// Función para resolver:</span> {selectedChallenge.title.toLowerCase().replace(/ /g, '_')}()
            </div>

            {submissionResult && (
              <div style={{ 
                padding: '16px', 
                borderRadius: '12px', 
                marginBottom: '20px', 
                fontWeight: '600',
                fontSize: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                backgroundColor: submissionResult.status === 'Aceptado' ? '#f0fdf4' : '#fef2f2', 
                color: submissionResult.status === 'Aceptado' ? '#166534' : '#991b1b',
                border: `1px solid ${submissionResult.status === 'Aceptado' ? '#bbf7d0' : '#fca5a5'}`,
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
              }}>
                <span>{submissionResult.status === 'Aceptado' ? '✅ ¡Prueba superada con éxito!' : '❌ Error de compilación (Falta usar "return")'}</span>
                <span style={{ fontSize: '11px', fontWeight: '400', color: '#64748b' }}>ID de transación: {submissionResult.id}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '10px', color: '#334155', fontSize: '14px' }}>Escribe tu propuesta de código:</label>
              <textarea 
                rows="5"
                value={codeAnswer}
                onChange={(e) => setCodeAnswer(e.target.value)}
                placeholder="function solucion() {&#10;  return ...&#10;}"
                required
                style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid #e2e8f0', fontFamily: 'monospace', fontSize: '13px', boxSizing: 'border-box', marginBottom: '20px', resize: 'vertical', outline: 'none', transition: 'border-color 0.2s', backgroundColor: '#f8fafc' }}
                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <button 
                type="submit" 
                style={{ width: '100%', padding: '14px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', fontSize: '15px', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)', transition: 'all 0.2s' }}
                onMouseOver={(e) => e.target.style.background = '#4338ca'}
                onMouseOut={(e) => e.target.style.background = '#4f46e5'}
              >
                Enviar Solución Temeraria
              </button>
            </form>
          </div>
        ) : (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '40px 0' }}>Selecciona un desafío del panel izquierdo.</p>
        )}
      </div>

    </div>
  );
}