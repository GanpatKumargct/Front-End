export function BackgroundGraphic() {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02] z-0">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] bg-repeat" />
      <svg className="absolute top-1/4 left-1/4 w-96 h-96 opacity-20" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.5" />
        <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      <svg className="absolute bottom-1/4 right-1/4 w-80 h-80 opacity-20" viewBox="0 0 200 200">
        <rect x="40" y="40" width="120" height="120" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <rect x="60" y="60" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <line x1="40" y1="40" x2="160" y2="160" stroke="currentColor" strokeWidth="0.5" />
        <line x1="160" y1="40" x2="40" y2="160" stroke="currentColor" strokeWidth="0.5" />
      </svg>
    </div>
  );
}
