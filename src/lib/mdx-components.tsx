import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1
        className="text-4xl font-bold mt-10 mb-6"
        {...props}
      />
    ),

    h2: (props) => (
      <h2
        className="text-3xl font-semibold mt-8 mb-5"
        {...props}
      />
    ),

    h3: (props) => (
      <h3
        className="text-2xl font-semibold mt-6 mb-4"
        {...props}
      />
    ),

    h4: (props) => (
      <h4
        className="text-xl font-medium mt-5 mb-3"
        {...props}
      />
    ),

    p: (props) => <p className="leading-7 mb-4 text-zinc-700" {...props} />,

    ul: (props) => <ul className="list-disc pl-6 space-y-2" {...props} />,

    table: (props) => (
      <table
        className="mb-6 w-full border-collapse overflow-hidden rounded-xl border border-slate-200"
        {...props}
      />
    ),

    thead: (props) => <thead className="bg-slate-200" {...props} />,

    th: (props) => (
      <th
        className="border border-slate-100 px-4 py-3 text-left font-semibold"
        {...props}
      />
    ),
    tr: (props) => <tr className="even:bg-slate-100" {...props} />,
    // to bold first column: first:font-semibold
    td: (props) => (
      <td className="border border-slate-200 px-4 py-3" {...props} />
    ),

    ...components,
  };
}
