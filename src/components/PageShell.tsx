interface PageShellProps {
  children: React.ReactNode;
}

function PageShell({ children }: PageShellProps) {
  return (
    <main className="App" id="main-content">
      <div className="app-bg" aria-hidden="true" />
      {children}
    </main>
  );
}

export default PageShell;