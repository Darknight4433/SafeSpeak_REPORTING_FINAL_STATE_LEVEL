export interface RecorderInstance {
  start: () => Promise<void>;
  stop: () => Promise<Blob>;
  isRecording: () => boolean;
}

export function createRecorder(): RecorderInstance {
  let mediaStream: MediaStream | null = null;
  let mediaRecorder: MediaRecorder | null = null;
  let chunks: BlobPart[] = [];
  let recording = false;

  return {
    start: async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('No media devices available');
      }
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };
      mediaRecorder.start();
      recording = true;
    },
    stop: async () => {
      return new Promise<Blob>((resolve, reject) => {
        if (!mediaRecorder) {
          return reject(new Error('Recorder not started'));
        }

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          // stop tracks
          mediaStream?.getTracks().forEach(t => t.stop());
          mediaStream = null;
          mediaRecorder = null;
          chunks = [];
          recording = false;
          resolve(blob);
        };

        try {
          mediaRecorder.stop();
        } catch (e) {
          reject(e);
        }
      });
    },
    isRecording: () => recording
  };
}

export async function sendToTranscribe(apiUrl: string, audioBlob: Blob): Promise<string> {
  const form = new FormData();
  form.append('file', audioBlob, 'recording.webm');

  const resp = await fetch(`${apiUrl.replace(/\/$/, '')}/transcribe`, {
    method: 'POST',
    body: form,
  });

  if (!resp.ok) {
    const detail = await resp.text();
    throw new Error(`Transcription failed: ${resp.status} ${detail}`);
  }

  const data = await resp.json();
  return data.transcript || '';
}

// Convenience wrapper used by the app when an STT URL is not provided in env.
export async function transcribeUsingConfig(audioBlob: Blob): Promise<string> {
  const configured = (import.meta.env.VITE_STT_URL as string) || 'http://localhost:5000';
  return sendToTranscribe(configured, audioBlob);
}
