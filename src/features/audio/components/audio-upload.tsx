'use client';

import { useRef, useState } from 'react';

import { Upload, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { AudioRecord } from '@/features/types/audio.types';

interface Props {
  sectionId: string;
  onUploaded: (audio: AudioRecord) => void;
}

export function AudioUpload({ sectionId, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function upload(file?: File) {
    if (!file) return;

    setError('');

    const formData = new FormData();

    formData.append('sectionId', sectionId);
    formData.append('file', file);

    try {
      setLoading(true);

      const response = await fetch('/api/audio/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onUploaded(data.audio);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to upload audio');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept=".mp3,.m4a,.wav,audio/mpeg,audio/mp4,audio/wav"
        className="hidden"
        disabled={loading}
        onChange={(event) => {
          void upload(event.target.files?.[0]);
        }}
      />

      <Button
        type="button"
        variant="outline"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 size-4" />
            Upload / Replace Audio
          </>
        )}
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <p className="text-xs text-muted-foreground">
        MP3, M4A or WAV. Maximum 20 MB.
      </p>
    </div>
  );
}
