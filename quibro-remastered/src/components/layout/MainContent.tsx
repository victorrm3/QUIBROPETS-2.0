type MainContentProps = {
  children: React.ReactNode;
};

export function MainContent({ children }: MainContentProps) {
  return (
    <div className="relative z-10 flex min-h-0 flex-1 flex-col bg-black shadow-[0_24px_48px_rgba(0,0,0,0.55)]">
      {children}
    </div>
  );
}
