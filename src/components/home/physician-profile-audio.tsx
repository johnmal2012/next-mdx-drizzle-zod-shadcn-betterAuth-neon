"use client";

import { useEffect, useState } from "react";

type PhysicianProfileAudioProps = {
  audioKey: string;
};

export default function PhysicianProfileAudio({
  audioKey,
}: PhysicianProfileAudioProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAudio() {
      try {
        setLoading(true);
        setError(null);
        setAudioUrl(null);

        const response = await fetch(
          `/api/audio?key=${encodeURIComponent(audioKey)}`
        );

        if (!response.ok) {
          throw new Error("Unable to load physician audio");
        }

        const data = await response.json();

        if (!cancelled) {
          setAudioUrl(data.url);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Audio unavailable"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAudio();

    return () => {
      cancelled = true;
    };
  }, [audioKey]);

  if (loading) {
    return <p>Loading physician introduction...</p>;
  }

  if (error || !audioUrl) {
    return <p>Physician audio is currently unavailable.</p>;
  }

  return (
    <div className="w-full">
      <audio
        controls
        preload="none"
        className="w-full"
        src={audioUrl}
      >
        Your browser does not support audio playback.
      </audio>
    </div>
  );
}
