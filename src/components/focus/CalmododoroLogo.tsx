interface CalmododoroLogoProps {
  className?: string;
}

export const CalmododoroLogo = ({ className = "h-12 w-auto" }: CalmododoroLogoProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 240"
      fill="none"
      className={className}
    >
      {/* Shadow */}
      <ellipse cx="100" cy="215" rx="50" ry="8" fill="currentColor" opacity="0.1"/>

      {/* Tomato body (circle) */}
      <circle cx="100" cy="100" r="65" stroke="currentColor" strokeWidth="4" fill="none"/>
      <circle cx="100" cy="100" r="72" stroke="currentColor" strokeWidth="8" fill="none"/>

      {/* Tomato leaves (top) */}
      <g transform="translate(100, 28)">
        {/* Center leaf */}
        <path
          d="M 0,-8 Q -3,-15 -5,-22 Q -3,-18 0,-16 Q 3,-18 5,-22 Q 3,-15 0,-8 Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        />
        {/* Left leaf */}
        <path
          d="M -10,-4 Q -15,-8 -20,-12 Q -16,-9 -12,-6 Q -12,-3 -15,-1 Q -10,-2 -10,-4 Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        />
        {/* Left-middle leaf */}
        <path
          d="M -5,-6 Q -10,-12 -14,-18 Q -10,-13 -6,-10 Q -6,-7 -8,-5 Q -5,-5 -5,-6 Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        />
        {/* Right leaf */}
        <path
          d="M 10,-4 Q 15,-8 20,-12 Q 16,-9 12,-6 Q 12,-3 15,-1 Q 10,-2 10,-4 Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        />
        {/* Right-middle leaf */}
        <path
          d="M 5,-6 Q 10,-12 14,-18 Q 10,-13 6,-10 Q 6,-7 8,-5 Q 5,-5 5,-6 Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        />
      </g>

      {/* Clock face dots (hour markers) */}
      <circle cx="100" cy="55" r="3" fill="currentColor"/>
      <circle cx="128" cy="63" r="3" fill="currentColor"/>
      <circle cx="145" cy="82" r="3" fill="currentColor"/>
      <circle cx="152" cy="100" r="3" fill="currentColor"/>
      <circle cx="145" cy="118" r="3" fill="currentColor"/>
      <circle cx="128" cy="137" r="3" fill="currentColor"/>
      <circle cx="100" cy="145" r="3" fill="currentColor"/>
      <circle cx="72" cy="137" r="3" fill="currentColor"/>
      <circle cx="55" cy="118" r="3" fill="currentColor"/>
      <circle cx="48" cy="100" r="3" fill="currentColor"/>
      <circle cx="55" cy="82" r="3" fill="currentColor"/>
      <circle cx="72" cy="63" r="3" fill="currentColor"/>

      {/* Clock hands */}
      {/* Hour hand (pointing to 10) */}
      <line
        x1="100"
        y1="100"
        x2="70"
        y2="78"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Minute hand (pointing to 2) */}
      <line
        x1="100"
        y1="100"
        x2="125"
        y2="72"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Center dot */}
      <circle cx="100" cy="100" r="5" fill="currentColor"/>

      {/* Calmodoro text */}
      <text
        x="100"
        y="200"
        fontFamily="Arial, sans-serif"
        fontSize="32"
        fontWeight="700"
        textAnchor="middle"
        fill="currentColor"
      >
        Calmodoro
      </text>
    </svg>
  );
};
