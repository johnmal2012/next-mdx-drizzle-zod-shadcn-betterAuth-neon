import { Card } from '@/components/ui/card';
import { renderMDX } from '@/lib/mdx';

interface Props {
  content: string;
  title: string;
}

export default function InsuranceSection({ title, content }: Props) {
  const mdx = renderMDX(content);
  return (
    <section
      id="insurance"
      className="scroll-mt-28 bg-slate-100 px-6 py-12"
    >
      <div className="mx-auto max-w-5xl">
        <Card className="rounded-3xl p-10 shadow-lg">
          <h2 className="mb-8 text-3xl font-bold">
            {title}
          </h2>

          <div className="prose max-w-none">
            {mdx}
          </div>
        </Card>
      </div>
    </section>
  );
}