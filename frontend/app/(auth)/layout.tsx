export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
      <div className="relative z-10 flex-grow">
        {children}
      </div>
    </div>
  );
}