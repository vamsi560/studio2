import { Logo } from "@/components/logo"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-20 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Logo />
          <h1 className="text-3xl font-bold font-headline text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Sahayak AI
          </h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  )
}
