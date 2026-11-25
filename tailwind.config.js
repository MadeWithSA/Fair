export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: { extend: {
    fontFamily: { sans: ['Inter', 'sans-serif'] },
    colors: { fair: { ice: '#F4F9FF', dark: '#080E1A', card: '#111B2E', border: '#1E2D4A' } },
    animation: {
      'blob-a': 'blobA 14s ease-in-out infinite', 'blob-b': 'blobB 18s ease-in-out infinite',
      levitate: 'levitate 6s ease-in-out infinite', pop: 'pop .4s cubic-bezier(.175,.885,.32,1.275)',
      slide: 'slide .38s cubic-bezier(.16,1,.3,1)', fade: 'fade .3s ease', zoom: 'zoom .36s cubic-bezier(.16,1,.3,1)',
      plus: 'plus .75s cubic-bezier(.16,1,.3,1) forwards', toast: 'toast .3s ease',
    },
    keyframes: {
      blobA: { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '50%': { transform: 'translate(28px,-22px) scale(1.06)' } },
      blobB: { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '50%': { transform: 'translate(-24px,26px) scale(1.05)' } },
      levitate: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      pop: { '0%': { transform: 'scale(1)' }, '40%': { transform: 'scale(1.38)' }, '75%': { transform: 'scale(.92)' }, '100%': { transform: 'scale(1)' } },
      slide: { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
      fade: { from: { opacity: 0 }, to: { opacity: 1 } },
      zoom: { from: { opacity: 0, transform: 'scale(.95)' }, to: { opacity: 1, transform: 'scale(1)' } },
      plus: { '0%': { opacity: 1, transform: 'translateY(0)' }, '100%': { opacity: 0, transform: 'translateY(-28px)' } },
      toast: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
    },
  } },
}
