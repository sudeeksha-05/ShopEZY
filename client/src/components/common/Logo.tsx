
interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ className = '', iconOnly = false, variant = 'dark', size = 'md' }: LogoProps) {
  // Size presets
  const sizeClasses = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', container: 'gap-1.5' },
    md: { icon: 'w-8 h-8', text: 'text-xl', container: 'gap-2' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl', container: 'gap-3' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl', container: 'gap-4' },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center ${currentSize.container} ${className}`}>
      {/* Creative Dynamic Logo Icon */}
      <div className={`relative ${currentSize.icon} shrink-0 select-none group`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
        >
          <defs>
            {/* Background Gradient - Premium Emerald to Teal */}
            <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" /> {/* Emerald 500 */}
              <stop offset="100%" stopColor="#0F766E" /> {/* Teal 700 */}
            </linearGradient>
            
            {/* Accent Gradient - Bright Amber Gold */}
            <linearGradient id="logoAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" /> {/* Amber 500 */}
              <stop offset="100%" stopColor="#D97706" /> {/* Amber 600 */}
            </linearGradient>

            {/* Glowing filter */}
            <filter id="cartGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Roundel Shield */}
          <rect
            x="10"
            y="10"
            width="80"
            height="80"
            rx="24"
            fill="url(#logoBgGrad)"
          />

          {/* Stylized Modern Shopping Cart representing Speed and Ease (EZ) */}
          {/* Cart Basket Silhouette */}
          <path
            d="M28 32 H38 L45 60 H72 L79 40 H40"
            stroke="#FFFFFF"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#cartGlow)"
          />

          {/* Cart Handle forming an 'e' line */}
          <path
            d="M24 24 H30 L35 32"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Cart Wheels in Contrast Amber Gold */}
          <circle
            cx="48"
            cy="72"
            r="6.5"
            fill="url(#logoAccent)"
          />
          <circle
            cx="69"
            cy="72"
            r="6.5"
            fill="url(#logoAccent)"
          />

          {/* Sparkling Speed Lines behind the cart */}
          <path
            d="M16 40 H22 M12 48 H20 M14 56 H18"
            stroke="url(#logoAccent)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Stylized Logo Text */}
      {!iconOnly && (
        <span
          className={`font-black tracking-tight select-none ${currentSize.text}`}
        >
          <span className={variant === 'light' ? 'text-white' : 'text-gray-900'}>Shop</span>
          <span className="bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#F59E0B] bg-clip-text text-transparent drop-shadow-sm font-black">
            EEZZ
          </span>
        </span>
      )}
    </div>
  );
}
