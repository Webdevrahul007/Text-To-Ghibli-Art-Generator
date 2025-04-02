export function Footer() {
  return (
    <footer className="py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()}{' '}
          <span>Ghibli Art Generator.</span> All rights reserved.
        </p>
        <p className="text-center text-sm text-muted-foreground">
          This is an AI art demo. Not affiliated with Studio Ghibli.
        </p>
      </div>
    </footer>
  )
}
