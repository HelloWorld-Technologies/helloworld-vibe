export function ShareIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <circle
        cx="18"
        cy="5"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="6"
        cy="12"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="18"
        cy="19"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8.59 13.51 15.42 17.49M15.41 6.51 8.59 10.49"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
