export function SiteStatusBanner() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="w-full bg-yellow-400 px-4 py-2 text-center text-sm font-bold text-black">
      DRAFT / DEMO SITE — NOT PRODUCTION
    </div>
  );
}