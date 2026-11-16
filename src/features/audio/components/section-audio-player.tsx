'use client';

import { useRef, useState } from 'react';

import { Play, Pause, Loader2, Volume2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface Props {
  sectionId: string;
  fileName: string;
}

export function SectionAudioPlayer({
  sectionId,
  fileName,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');

  async function togglePlayback() {
    const audio = audioRef.current;

    if (!audio) return;

    setError('');

    // Pause current playback.
    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      setLoading(true);

      let audioUrl = url;

      // Retrieve a fresh signed URL when necessary.
      if (!audioUrl) {
        const response = await fetch(
          `/api/audio/${sectionId}/play`,
          {
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          throw new Error('Unable to retrieve audio URL');
        }

        const data = await response.json();

        if (!data.url) {
          throw new Error('Audio URL is missing');
        }

        audioUrl = data.url;
        setUrl(audioUrl);

        // IMPORTANT: Assign the URL BEFORE calling play().
        audio.src = audioUrl;
        audio.load();
      }

      // Start playback. Do not wait for canplay before assigning src.
      await audio.play();

    } catch (err) {
      console.error('Audio playback error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to play audio.'
      );

      // Clear potentially expired or invalid signed URL.
      setUrl('');

    } finally {
      setLoading(false);
    }
  }

  function formatTime(seconds: number) {
    if (!Number.isFinite(seconds)) return '0:00';

    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);

    return `${minutes}:${String(remaining).padStart(2, '0')}`;
  }

  return (
    <div className="space-y-3 rounded-lg border p-3">

      <div className="flex items-center gap-2">

        <Volume2 className="size-4 text-muted-foreground" />

        <span className="flex-1 truncate text-sm font-medium">
          {fileName}
        </span>

        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={togglePlayback}
          disabled={loading}
          aria-label={playing ? 'Pause audio' : 'Play audio'}
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : playing ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )}
        </Button>

      </div>

      <audio
        ref={audioRef}
        preload="none"

        onLoadStart={() => setLoading(true)}

        onLoadedMetadata={(event) => {
          const value = event.currentTarget.duration;

          setDuration(
            Number.isFinite(value) ? value : 0
          );

          setLoading(false);
        }}

        onDurationChange={(event) => {
          const value = event.currentTarget.duration;

          if (Number.isFinite(value)) {
            setDuration(value);
          }
        }}

        onCanPlay={() => setLoading(false)}

        onPlaying={() => {
          setPlaying(true);
          setLoading(false);
        }}

        onPause={() => {
          setPlaying(false);
          setLoading(false);
        }}

        onWaiting={() => setLoading(true)}

        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime);
        }}

        onEnded={() => {
          setPlaying(false);
          setCurrentTime(0);
        }}

        onError={(event) => {
          console.error(
            'Audio element error:',
            event.currentTarget.error
          );

          setPlaying(false);
          setLoading(false);
          setUrl('');

          setError('Unable to load audio file.');
        }}
      />

      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={Math.min(currentTime, duration || 0)}
        disabled={!duration}
        onChange={(event) => {
          const value = Number(event.target.value);

          if (audioRef.current) {
            audioRef.current.currentTime = value;
            setCurrentTime(value);
          }
        }}
        className="w-full cursor-pointer accent-primary"
        aria-label="Audio playback position"
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

    </div>
  );
}
