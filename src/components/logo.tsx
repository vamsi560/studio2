export function Logo() {
  return (
    <div className="flex items-center justify-center bg-primary/10 rounded-lg p-2 border border-primary/20">
      <svg
        className="w-8 h-8 text-primary"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        <path d="m15.5 6.5 1-2.5 2.5 1-1 2.5" />
        <path d="m13.5 11.5 1-2.5 2.5 1-1 2.5" />
        <path d="M8 14h6" />
        <path d="M8 18h6" />
      </svg>
    </div>
  )
}
