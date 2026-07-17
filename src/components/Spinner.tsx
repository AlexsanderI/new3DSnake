import React from 'react'
import { Html, useProgress } from '@react-three/drei'
import '../styles/spinner.css'

const Spinner: React.FC = () => {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className='spinner-container'>
        <i className='fa-solid fa-spinner fa-spin'></i>
        <p>{progress.toFixed(0)}%</p>
      </div>
    </Html>
  )
}

export default Spinner
