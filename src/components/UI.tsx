export default function UI() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '40px',
      color: 'white',
      textShadow: '0 2px 10px rgba(0,0,0,0.2)'
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: 800 }}>MY PORTFOLIO</h1>
        <p style={{ margin: 0, fontSize: '1.2rem', opacity: 0.8 }}>Interactive 3D Experience</p>
      </div>
      
      <div style={{ alignSelf: 'flex-start', background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Controls</h3>
        <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: '#fff', color: '#000', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>W A S D</span> to drive
        </p>
        <p style={{ margin: '10px 0 0 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: '#fff', color: '#000', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>SPACE</span> to brake
        </p>
      </div>
    </div>
  )
}
