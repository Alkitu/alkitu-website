interface AlkituIconProps {
  size?: number;
  className?: string;
}

export const AlkituIcon = ({ size = 40, className = '' }: AlkituIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="12 12 36 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M27.9228 33.0681H34.2539L30.0243 20.1764L22.0774 44.4852H14.2188L25.6977 14.3044H34.4393L43.7196 38.7899H26.0597L27.9228 33.0681Z"
        fill="currentColor"
      />
      <path
        d="M44.4798 40.7944L45.8838 44.4853H38.034L36.8154 40.7944H44.4798Z"
        fill="#00BB31"
      />
    </svg>
  );
};

export default AlkituIcon;
