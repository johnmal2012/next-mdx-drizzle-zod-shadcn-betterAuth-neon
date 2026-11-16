"use client";

import { useRef, useState } from "react";

interface AudioPlayerProps {
  src: string;
  fileName?: string;
}

export default function AudioPlayer({
  src,
  fileName,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    setError("");

    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      setIsLoading(true);
      await audio.play();
    } catch (err) {
      console.error("Audio playback error:", err);
      setIsLoading(false);
      setError("Unable to play this audio file.");
    }
  }

  function formatTime(seconds: number) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return (
    <div className="w-full rounded-lg border p-3">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadStart={() => setIsLoading(true)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration || 0);
          setIsLoading(false);
        }}
        onDurationChange={(e) => {
          setDuration(e.currentTarget.duration || 0);
        }}
        onCanPlay={() => setIsLoading(false)}
        onPlaying={() => {
          setIsPlaying(true);
          setIsLoading(false);
        }}
        onPause={() => {
          setIsPlaying(false);
          setIsLoading(false);
        }}
        onWaiting={() => setIsLoading(true)}
        onTimeUpdate={(e) => {
          setCurrentTime(e.currentTarget.currentTime);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onError={(e) => {
          console.error(
            "Audio element error:",
            e.currentTarget.error
          );
          setIsPlaying(false);
          setIsLoading(false);
          setError("Unable to load audio file.");
        }}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-gray-500">◖♪</span>
          <span className="truncate text-sm font-medium">
            {fileName || "Audio recording"}
          </span>
        </div>

        <button
          type="button"
          onClick={togglePlayback}
          disabled={isLoading && !isPlaying}
          aria-label={
            isPlaying ? "Pause audio" : "Play audio"
          }
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border hover:bg-gray-100 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="animate-spin">◌</span>
          ) : isPlaying ? (
            "Ⅱ"
          ) : (
            "▶"
          )}
        </button>
      </div>

      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={Math.min(currentTime, duration || 0)}
        onChange={(e) => {
          const value = Number(e.target.value);

          if (audioRef.current) {
            audioRef.current.currentTime = value;
            setCurrentTime(value);
          }
        }}
        disabled={!duration}
        className="mt-3 w-full cursor-pointer"
      />

      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
