/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F4FF',
          100: '#E0EAFF',
          200: '#C7D8FF',
          300: '#A3BFFA',
          400: '#6B7FDB',
          500: '#5B68DB', // Main brand
          600: '#4C51BF',
          700: '#3C3D99',
        },
        accent: {
          50: '#F0FDF9',
          100: '#CCFBEF',
          400: '#2DD4BF',
          500: '#14B8A6', // Success/teal
          600: '#0F9688',
        },
        warm: {
          50: '#FFFBF5',
          100: '#FFF3E0',
          400: '#FFB74D',
          500: '#FF9800', // Energy/amber
        },
        neutral: {
          50: '#FAFBFC',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          600: '#4B5563',
          800: '#1F2937',
          900: '#111827',
        }
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #F0F4FF 0%, #FFFBF5 50%, #F0FDF9 100%)',
        'gradient-mesh': 'radial-gradient(at 0% 0%, rgba(91, 104, 219, 0.1) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(45, 212, 191, 0.08) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(255, 184, 77, 0.05) 0px, transparent 50%)',
        'gradient-button': 'linear-gradient(145deg, #5B68DB, #4C51BF)',
        'gradient-card-hover': 'linear-gradient(145deg, #FFFFFF 0%, #F0F4FF 100%)',
        'gradient-success': 'linear-gradient(135deg, #CCFBEF 0%, #E0EAFF 100%)',
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 15px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'primary': '0 10px 25px rgba(91, 104, 219, 0.25)',
        'success': '0 10px 25px rgba(20, 184, 166, 0.25)',
        'modal': '0 25px 50px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'bounce-in': 'bounceIn 0.6s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.2s ease-in',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'scale-in': 'scaleIn 0.2s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}