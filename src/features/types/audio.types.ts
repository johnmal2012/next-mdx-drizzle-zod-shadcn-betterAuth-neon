export type AudioRecord = {
  id: string;
  sectionId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  durationSeconds: number | null;
};

export type AudioSection = {
  id: string;
  title: string;
  audio: AudioRecord | null;
};

export interface AudioResponse {
  success: boolean;
  audios: {
    sectionId: string;
    title: string;
    fileName: string;
    src: string;
  }[];
}
