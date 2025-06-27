export default function Header() {
  return (
    <header className="bg-black text-white py-6 border-b-4 border-red-500">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              kuntcalend.ar
            </h1>
            <p className="text-gray-300 text-sm mt-1">
              Raw daily tracking. No bullshit.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">
              Track your wins, losses,<br />
              and everything in between
            </p>
          </div>
        </div>
      </div>
    </header>
  );
} 