"use client";

import { useState, type FormEvent } from "react";

type Section = {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  sortOrder: number;
};

type Props = {
  initialSections: Section[];
};

export default function SectionsManager({
  initialSections,
}: Props) {
  const [sections, setSections] = useState(initialSections);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter a section title.");
      return;
    }

    setBusy(true);

    try {
      const response = await fetch("/api/sections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          content,
          sortOrder: Number(sortOrder),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create section.");
      }

      setSections((previous) =>
        [...previous, data.section].sort(
          (a, b) =>
            a.sortOrder - b.sortOrder ||
            a.title.localeCompare(b.title)
        )
      );

      setTitle("");
      setDescription("");
      setContent("");
      setSortOrder("0");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred."
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate(
    e: FormEvent<HTMLFormElement>,
    sectionId: string
  ) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    const updatedSection = {
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      content: String(formData.get("content") || ""),
      sortOrder: Number(formData.get("sortOrder") || 0),
    };

    setBusy(true);

    try {
      const response = await fetch(`/api/sections/${sectionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSection),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update section.");
      }

      setSections((previous) =>
        previous
          .map((section) =>
            section.id === sectionId ? data.section : section
          )
          .sort(
            (a, b) =>
              a.sortOrder - b.sortOrder ||
              a.title.localeCompare(b.title)
          )
      );

      setEditingId(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred."
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(sectionId: string) {
    if (!window.confirm("Delete this section?")) return;

    setError("");
    setBusy(true);

    try {
      const response = await fetch(`/api/sections/${sectionId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete section.");
      }

      setSections((previous) =>
        previous.filter((section) => section.id !== sectionId)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Create section */}
      <section className="rounded-lg border bg-card p-5">
        <h2 className="mb-4 text-xl font-semibold">
          Create New Section
        </h2>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Section Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Introduction"
              maxLength={200}
              required
              className="w-full rounded-md border bg-background px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a short description"
              rows={2}
              maxLength={2000}
              className="w-full rounded-md border bg-background px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter section content (optional)"
              rows={4}
              className="w-full rounded-md border bg-background px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Sort Order
            </label>
            <input
              type="number"
              min="0"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-primary px-5 py-2 text-primary-foreground disabled:opacity-50"
          >
            {busy ? "Saving..." : "Create Section"}
          </button>
        </form>
      </section>

      {/* Error message */}
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Existing sections */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Existing Sections
          </h2>
          <span className="text-sm text-muted-foreground">
            {sections.length} section(s)
          </span>
        </div>

        {sections.length === 0 ? (
          <div className="rounded-lg border p-10 text-center text-muted-foreground">
            No sections found. Create your first section above.
          </div>
        ) : (
          sections.map((section) => (
            <div
              key={section.id}
              className="rounded-lg border bg-card p-5"
            >
              {editingId === section.id ? (
                <form
                  onSubmit={(e) => handleUpdate(e, section.id)}
                  className="space-y-3"
                >
                  <input
                    name="title"
                    defaultValue={section.title}
                    required
                    maxLength={200}
                    className="w-full rounded-md border bg-background px-3 py-2"
                  />

                  <textarea
                    name="description"
                    defaultValue={section.description ?? ""}
                    rows={2}
                    maxLength={2000}
                    className="w-full rounded-md border bg-background px-3 py-2"
                  />

                  <textarea
                    name="content"
                    defaultValue={section.content ?? ""}
                    rows={4}
                    className="w-full rounded-md border bg-background px-3 py-2"
                  />

                  <input
                    name="sortOrder"
                    type="number"
                    min="0"
                    defaultValue={section.sortOrder}
                    className="w-full rounded-md border bg-background px-3 py-2"
                  />

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={busy}
                      className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
                    >
                      Save Changes
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-md border px-4 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div className="min-w-0">
                    <h3 className="font-semibold">
                      {section.title}
                    </h3>

                    {section.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-muted-foreground">
                      Sort order: {section.sortOrder}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(section.id)}
                      disabled={busy}
                      className="rounded-md border px-4 py-2 text-sm"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(section.id)}
                      disabled={busy}
                      className="rounded-md border border-red-300 px-4 py-2 text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
