import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="max-w-[1120px] mx-auto px-5 sm:px-10 py-10 sm:py-20 pb-20 sm:pb-[80px] text-center">
        {/* Logo lockup */}
        <div className="flex items-center justify-center sm:justify-end gap-3 mb-12 sm:mb-[48px]">
          <Image
            src="/svac.svg"
            alt="Sky Valley"
            width={50}
            height={50}
            className="w-[50px] h-[50px]"
          />
          <div className="font-[family-name:var(--font-monarca)] text-[0.9rem] tracking-[0.04em] text-[var(--color-muted)] font-semibold uppercase whitespace-nowrap">
            Sky Valley Ambient Computing
          </div>
        </div>

        {/* Hero */}
        <h1 className="m-0 mb-8 font-[family-name:var(--font-monarca)] font-medium leading-[0.95] tracking-[-0.02em]">
          <span className="block text-[clamp(48px,6vw,64px)] text-[var(--color-orange)] text-center sm:text-left sm:ml-[15%] mb-2">
            Tools &amp;
          </span>
          <span className="block text-[clamp(48px,10vw,72px)] text-[var(--color-ink)] text-center sm:text-right sm:mr-[15%]">
            Infrastructure
          </span>
        </h1>

        {/* Download section */}
        <div className="max-w-[68ch] mx-auto text-left mt-12">
          <div className="space-y-6">
            {/* Differ download */}
            <div className="block p-6 bg-white/50 rounded-lg border border-[var(--color-muted)]/20">
              <h3 className="font-sans font-semibold text-lg mb-2 text-[var(--color-ink)]">
                <a
                  href="https://getdiffer.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-[3px] hover:text-[var(--color-orange)]"
                >
                  Differ
                </a> for Mac
              </h3>
              <p className="text-[var(--color-sub)] text-sm">
                System of record for dynamic systems. Understand, govern, and safely evolve your AI-generated software.
              </p>
              <a
                href="/differ/latest"
                className="inline-block mt-3 text-[var(--color-orange)] text-sm font-medium hover:underline underline-offset-[3px]"
              >
                Download latest version →
              </a>
            </div>
          </div>

          <p className="mt-8 text-[var(--color-muted)] text-sm">
            Learn more about our tools at{' '}
            <a
              href="https://skyvalley.ac"
              className="text-[var(--color-ink)] underline underline-offset-[3px] hover:text-[var(--color-orange)]"
            >
              skyvalley.ac
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
