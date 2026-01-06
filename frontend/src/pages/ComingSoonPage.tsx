export default function ComingSoonPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 text-slate-900">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/Background.png)' }}
      />

      <div className="relative flex min-h-screen items-center justify-center py-14">
        <div className="mx-auto w-full max-w-2xl text-center font-kdam">
          <img
            src="/ghs-carnival-logo.png"
            alt="GHS Carnival"
            className="mx-auto w-[min(520px,92vw)] select-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
            draggable={false}
            decoding="async"
          />

          <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              We Are Cooking
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-7 text-slate-600 sm:text-lg">
            <span className="block">Stay tuned.</span>
          </p>

          <p className="mx-auto mt-8 max-w-sm text-center text-xs leading-5 text-slate-500">
            Thanks for your patience. Check back soon.
          </p>
        </div>
      </div>
    </main>
  )
}
