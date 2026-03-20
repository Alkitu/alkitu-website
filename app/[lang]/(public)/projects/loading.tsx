export default function ProjectsLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative flex items-center justify-center">
        {/* Ripple rings */}
        <span className="absolute h-5 w-5 rounded-full border-2 border-primary animate-[ripple_1.5s_ease-out_infinite]" />
        <span className="absolute h-5 w-5 rounded-full border-2 border-primary animate-[ripple_1.5s_ease-out_0.5s_infinite]" />
        <span className="absolute h-5 w-5 rounded-full border-2 border-primary animate-[ripple_1.5s_ease-out_1s_infinite]" />
        {/* Center dot */}
        <span className="h-3 w-3 rounded-full bg-primary" />
      </div>
    </div>
  );
}
