import '@/styles/globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Globe } from 'lucide-react';

export default function NotFound() {
  return (
    <html lang="es">
      <body className="bg-zinc-950 antialiased">
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 text-center selection:bg-purple-500 selection:text-white">

          {/* Background Grid */}
          <div
            className="absolute inset-0 z-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />

          <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto px-6 w-full">

            {/* Main Content Container with Border */}
            <div className="relative w-full border-4 border-zinc-800 bg-zinc-900/80 backdrop-blur-md p-8 md:p-12 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-16 max-w-6xl">

              {/* Left Column: Image */}
              <div className="w-full md:w-1/2 flex flex-col">
                <div className="relative rounded-[2rem] overflow-hidden border-4 border-zinc-950/50 shadow-inner group w-full h-full min-h-[300px] md:min-h-[500px]">
                  <Image
                    src="/images/errors/404-general.png"
                    alt="404 Disconnection"
                    fill
                    className="object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                    priority
                  />
                  {/* Scanline effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent bg-[length:100%_4px] pointer-events-none opacity-20" />
                </div>
              </div>

              {/* Right Column: Content */}
              <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left">

                {/* Header Tags */}
                <div className="w-full flex justify-between items-center mb-8 border-b-2 border-zinc-700 pb-4">
                  <span className="font-mono text-xs md:text-sm text-zinc-500 uppercase tracking-widest">Error: 404_PAGE_NOT_FOUND</span>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                </div>

                {/* Brutalist Typography */}
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-2 tracking-tighter uppercase relative select-none leading-none">
                  <span className="absolute -inset-1 text-purple-600 blur-sm opacity-50 -z-10">404</span>
                  404<br />ERROR
                </h1>

                <h2 className="text-xl md:text-2xl font-bold text-zinc-400 mb-8 uppercase tracking-widest border-2 border-zinc-700 inline-block px-4 py-1 rounded-full">
                  System Disconnect
                </h2>

                <p className="mb-10 text-lg text-zinc-400 font-mono leading-relaxed">
                  [ES] La conexión se ha perdido. El destino no existe.
                  <br />
                  [EN] Connection lost. Destination does not exist.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center md:justify-start">
                  <Link
                    href="/es"
                    className="flex items-center justify-center bg-primary text-black font-black uppercase tracking-wider py-4 px-8 rounded-xl hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.3)] w-full sm:w-auto"
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Inicio (ES)
                  </Link>

                  <Link
                    href="/en"
                    className="flex items-center justify-center bg-transparent border-2 border-zinc-600 text-white font-black uppercase tracking-wider py-4 px-8 rounded-xl hover:border-white hover:bg-zinc-800 transition-all duration-300 w-full sm:w-auto"
                  >
                    <Globe className="mr-2 h-5 w-5" />
                    Home (EN)
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Footer System Lines */}
          <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 py-2 px-6 flex justify-between items-center z-50">
            <span className="font-mono text-[10px] text-zinc-600 uppercase">Sys_Op: Navigation_Failure</span>
            <span className="font-mono text-[10px] text-zinc-600 uppercase">Code: 0xDEADBEEF</span>
          </div>
        </div>
      </body>
    </html>
  );
}
