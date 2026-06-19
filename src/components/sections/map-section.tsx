import { Card } from '@/components/ui/card';
// import { physicianData } from '@/data/physician';
// import { headingData } from '@/data/heading';

interface Props {
  location: string;
  address: string;
}

export default function MapSection({ location,address }: Props) {
  return (
    <section
      id="location"
      className="
        scroll-mt-28
        bg-slate-50
        px-6
        py-12
      "
    >
      <div className="mx-auto max-w-6xl">
        <Card className="overflow-hidden rounded-3xl shadow-xl">
          <div className="border-b px-8 py-6">
            <h2 className="text-3xl font-bold text-slate-900">
              {location}
            </h2>

            <p className="mt-2 text-slate-600">
              {address}
            </p>
          </div>

          <div className="h-112.5 w-full">
            <iframe
              title="Office Location Map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
              width="100%"
              height="100%"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="border-0"
            />
          </div>
        </Card>
      </div>
    </section>
  );
}