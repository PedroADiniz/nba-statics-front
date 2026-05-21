export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-muted text-xs">
          Dados via <span className="text-slate-400">stats.nba.com</span> · sem afiliação oficial com a NBA
        </p>
        <p className="text-muted text-xs">
          NBA <span className="text-nba-orange font-semibold">H2H</span> Analyzer
        </p>
      </div>
    </footer>
  );
}
