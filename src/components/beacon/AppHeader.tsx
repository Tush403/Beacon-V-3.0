import { SearchCode } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto py-4 px-4 md:px-8 flex items-center gap-3">
        <SearchCode className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-headline font-semibold text-primary">
            Beacon
          </h1>
          <p className="text-sm text-muted-foreground font-body">
            AI Test Tool Navigator
          </p>
        </div>
      </div>
    </header>
  );
}
