import logo from '../assets/simple_logo.png';

function Logo() {
  return (
    <img
      src={logo}
      alt="TrainNow Logo"
      style={{
        height: '40px',
        mixBlendMode: 'multiply',
        verticalAlign: 'middle',
        borderRadius: '4px'
      }}
    />
  );
}

export default Logo;
