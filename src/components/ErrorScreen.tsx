import React from 'react'
import { Html } from '@react-three/drei'

type ErrorMessage = {
  message: string
}

const ErrorScreen = ({ message }: ErrorMessage) => {
  return (
    <Html fullscreen>
      <div
        style={{
          height: '100vh',
          width: '100vw',
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Orbitron, sans-serif',
          color: '#00fff2',
          textShadow: '0 0 8px #00fff2',
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>CRITICAL ERROR</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{message}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: 'transparent',
            border: '2px solid #00fff2',
            padding: '0.5rem 1.5rem',
            color: '#00fff2',
            fontSize: '1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
          }}
          onMouseOver={(e) => {
            ;(e.target as HTMLButtonElement).style.backgroundColor = '#00fff2'
            ;(e.target as HTMLButtonElement).style.color = '#000'
          }}
          onMouseOut={(e) => {
            ;(e.target as HTMLButtonElement).style.backgroundColor = 'transparent'
            ;(e.target as HTMLButtonElement).style.color = '#00fff2'
          }}
        >
          RELOAD
        </button>
      </div>
    </Html>
  )
}

export default ErrorScreen
