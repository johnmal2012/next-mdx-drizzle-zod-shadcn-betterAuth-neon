export default function PhysicianIntroVideo() {
  return (
    <section
      aria-labelledby="physician-intro-heading"
      className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <h2
        id="physician-intro-heading"
        className="mb-5 text-2xl font-semibold tracking-tight text-slate-900"
      >
        Meet Dr. Nikki Lam
      </h2>

      <video
        className="aspect-video w-full rounded-xl bg-slate-100 shadow-sm"
        controls
        playsInline
        preload="metadata"
        poster="/remotion/aaron-profile.jpg"
      >
        <source
          src="/videos/physician-intro.mp4"
          type="video/mp4"
        />
        Your browser does not support HTML video.
      </video>
    </section>
  );
}
