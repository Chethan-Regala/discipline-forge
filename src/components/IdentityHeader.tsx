const IdentityHeader = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="text-center py-6 sm:py-8 border-b border-border">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
        2026 DISCIPLINE OS
      </h1>
      <div className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
        <span>Built for: </span>
        <span className="text-foreground font-medium">Chethan</span>
        <span className="mx-2">•</span>
        <span>Year: 2026</span>
      </div>
      <p className="text-muted-foreground italic text-xs sm:text-sm md:text-base px-2">
        "Sleep. Train. Learn. Build. Pray. Repeat."
      </p>
      <div className="mt-3 sm:mt-4 text-xs text-muted-foreground">
        {formattedDate}
      </div>
    </header>
  );
};

export default IdentityHeader;
