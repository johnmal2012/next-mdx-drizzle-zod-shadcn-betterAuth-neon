'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Music2, Trash2, FileAudio } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { AudioUpload } from './audio-upload';
import { SectionAudioPlayer } from './section-audio-player';
import { AudioRecord, AudioSection } from '@/features/types/audio.types';

interface Props {
  initialSections: AudioSection[];
}

export function AudioManager({ initialSections }: Props) {
  const router = useRouter();

  const [sections, setSections] = useState(initialSections);

  const [deleting, setDeleting] = useState<string | null>(null);

  const [error, setError] = useState('');

  function handleUploaded(audio: AudioRecord) {
    setSections((current) =>
      current.map((section) =>
        section.id === audio.sectionId ? { ...section, audio } : section,
      ),
    );

    router.refresh();
  }

  async function handleDelete(sectionId: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this audio recording?',
    );

    if (!confirmed) return;

    try {
      setDeleting(sectionId);
      setError('');

      const response = await fetch(`/api/audio/${sectionId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to delete audio');
      }

      setSections((current) =>
        current.map((section) =>
          section.id === sectionId ? { ...section, audio: null } : section,
        ),
      );

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(null);
    }
  }

  const total = sections.length;

  const recorded = sections.filter((section) => section.audio !== null).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total sections</p>
            <p className="text-2xl font-bold">{total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Recorded</p>
            <p className="text-2xl font-bold">{recorded}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold">{total - recorded}</p>
          </CardContent>
        </Card>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-4">
        {sections.map((section, index) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-muted p-2">
                    <Music2 className="size-5" />
                  </div>

                  <div>
                    <CardTitle className="text-base">
                      {String(index + 1).padStart(2, '0')}. {section.title}
                    </CardTitle>

                    <p className="text-xs text-muted-foreground">
                      {section.audio
                        ? 'Audio recording available'
                        : 'No audio recording'}
                    </p>
                  </div>
                </div>

                <span
                  className={
                    section.audio
                      ? 'text-xs text-green-600'
                      : 'text-xs text-muted-foreground'
                  }
                >
                  {section.audio ? 'Recorded' : 'Pending'}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {section.audio ? (
                <>
                  <SectionAudioPlayer
                    key={section.audio.id}
                    sectionId={section.id}
                    fileName={section.audio.fileName}
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileAudio className="size-4" />
                      {(section.audio.fileSize / 1024 / 1024).toFixed(2)} MB
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={deleting === section.id}
                      onClick={() => handleDelete(section.id)}
                    >
                      <Trash2 className="mr-2 size-4" />

                      {deleting === section.id ? 'Deleting...' : 'Delete audio'}
                    </Button>
                  </div>
                </>
              ) : null}

              <AudioUpload sectionId={section.id} onUploaded={handleUploaded} />
            </CardContent>
          </Card>
        ))}

        {total === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              No sections found.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
