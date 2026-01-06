/**
 * Speech abstraction for web and native (Capacitor/Cordova) builds.
 *
 * - Exports createRecognition() which returns an object with start/stop and event setters.
 * - Uses Web Speech API when available in the browser.
 * - Provides placeholders for native plugin integration (Capacitor/Cordova).
 *
 * Usage:
 * const rec = createRecognition({ lang: 'en-US' });
 * rec.onResult = (transcript) => { ... };
 * rec.start();
 */

export type RecognitionType = 'web' | 'native' | 'none';

export interface RecognitionInstance {
  type: RecognitionType;
  isSupported: boolean;
  start: () => Promise<void>;
  stop: () => void;
  // Event handlers
  onResult?: (transcript: string) => void;
  onError?: (err: any) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface CreateOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

// Detect whether a native plugin is available (Capacitor/Cordova)
export function isNativeAvailable(): boolean {
  // Example detection for Capacitor native runtime
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win: any = window as any;
    if (win && win.Capacitor && win.Capacitor.isNative) return true;
    // Add other runtime checks if needed
  } catch (e) {
    // ignore
  }
  return false;
}

export function isWebSpeechSupported(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win: any = window as any;
  return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
}

export function createRecognition(options?: CreateOptions): RecognitionInstance {
  // Native first
  if (isNativeAvailable()) {
    // Capacitor/Cordova plugin wiring (best-effort generalized integration)
    // Supports @capacitor-community/speech-recognition and similar plugins which:
    //  - expose requestPermission/start/stop
    //  - emit events via addListener(name, cb)
    let onResult: ((t: string) => void) | undefined;
    let onError: ((e: any) => void) | undefined;
    let onStart: (() => void) | undefined;
    let onEnd: (() => void) | undefined;

    // Track addListener removal functions
    const listeners: Array<() => void> = [];

    // Helper to try multiple event names returned by different plugins
    const possibleResultEvents = ['speechResult', 'onResult', 'result', 'transcription', 'partialResult'];
    const possibleStartEvents = ['start', 'onStart'];
    const possibleEndEvents = ['end', 'onEnd', 'stop'];
    const possibleErrorEvents = ['error', 'onError'];

    const plugin = (window as any).Capacitor?.Plugins?.SpeechRecognition || (window as any).SpeechRecognitionPlugin || (window as any).cordova?.plugins?.SpeechRecognition;

    const attachListeners = () => {
      if (!plugin || !plugin.addListener) return;

      possibleResultEvents.forEach((ev) => {
        try {
          const sub = plugin.addListener(ev, (payload: any) => {
            const text = typeof payload === 'string' ? payload : payload?.transcript || payload?.text || '';
            if (text) onResult && onResult(text);
          });
          listeners.push(() => sub.remove && sub.remove());
        } catch (e) {
          // ignore
        }
      });

      possibleStartEvents.forEach((ev) => {
        try {
          const sub = plugin.addListener(ev, () => onStart && onStart());
          listeners.push(() => sub.remove && sub.remove());
        } catch (e) {}
      });

      possibleEndEvents.forEach((ev) => {
        try {
          const sub = plugin.addListener(ev, () => onEnd && onEnd());
          listeners.push(() => sub.remove && sub.remove());
        } catch (e) {}
      });

      possibleErrorEvents.forEach((ev) => {
        try {
          const sub = plugin.addListener(ev, (err: any) => onError && onError(err));
          listeners.push(() => sub.remove && sub.remove());
        } catch (e) {}
      });
    };

    const detachListeners = () => {
      while (listeners.length) {
        try { listeners.pop()?.(); } catch (e) { /* ignore */ }
      }
    };

    return {
      type: 'native',
      isSupported: true,
      start: async () => {
        try {
          if (!plugin) throw new Error('Native speech plugin not found. Install @capacitor-community/speech-recognition or similar.');

          // Request permission if plugin exposes it
          if (plugin.requestPermission) {
            try {
              const perm = await plugin.requestPermission();
              // Some plugins return { granted: true }
              if (perm && perm.granted === false) throw new Error('Microphone permission denied');
            } catch (permErr) {
              // Try Android runtime permission flow via Capacitor
              try {
                await (window as any).Capacitor.Plugins?.Permissions?.requestPermissions({ permissions: ['android.permission.RECORD_AUDIO'] });
              } catch (_) {
                // ignore
              }
            }
          }

          attachListeners();

          // Some plugins return a result immediately; others stream via events
          const res = await (plugin.start ? plugin.start({ locale: options?.lang || 'en-US' }) : Promise.reject(new Error('Start not supported by plugin')));

          // If the plugin returned an immediate transcript
          if (res && (res.transcript || res.text)) {
            const text = res.transcript || res.text || '';
            onResult && onResult(text);
          }

          onStart && onStart();
        } catch (err) {
          onError && onError(err);
        }
      },
      stop: () => {
        try {
          if (plugin && plugin.stop) {
            plugin.stop();
          }
        } catch (err) {
          onError && onError(err);
        }

        detachListeners();
        onEnd && onEnd();
      },
      set onResult(cb) { onResult = cb; },
      get onResult() { return onResult; },
      set onError(cb) { onError = cb; },
      get onError() { return onError; },
      set onStart(cb) { onStart = cb; },
      get onStart() { return onStart; },
      set onEnd(cb) { onEnd = cb; },
      get onEnd() { return onEnd; }
    } as unknown as RecognitionInstance;
  }

  // Web fallback
  if (isWebSpeechSupported()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win: any = window as any;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    const recog = new SpeechRecognition();

    recog.continuous = options?.continuous ?? true;
    recog.interimResults = options?.interimResults ?? true;
    recog.lang = options?.lang || 'en-US';
    recog.maxAlternatives = 1;

    let onResult: ((t: string) => void) | undefined;
    let onError: ((e: any) => void) | undefined;
    let onStart: (() => void) | undefined;
    let onEnd: (() => void) | undefined;

    // Wire native SpeechRecognition events to our callbacks
    recog.onresult = (event: any) => {
      let fullTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript;
        if (i < event.results.length - 1) fullTranscript += ' ';
      }
      onResult && onResult(fullTranscript);
    };

    recog.onerror = (event: any) => {
      // Surface helpful details to the caller and also log
      console.warn('SpeechRecognition onerror', event);
      onError && onError(event);
    };

    recog.onstart = () => {
      onStart && onStart();
    };

    recog.onend = () => {
      onEnd && onEnd();
    };

    return {
      type: 'web',
      isSupported: true,
      start: async () => {
        try {
          recog.start();
        } catch (err) {
          // Some browsers throw if start called while already running
          // forward as error
          throw err;
        }
      },
      stop: () => {
        try {
          recog.stop();
        } catch (e) {
          // ignore
        }
      },
      set onResult(cb) { onResult = cb; },
      get onResult() { return onResult; },
      set onError(cb) { onError = cb; },
      get onError() { return onError; },
      set onStart(cb) { onStart = cb; },
      get onStart() { return onStart; },
      set onEnd(cb) { onEnd = cb; },
      get onEnd() { return onEnd; }
    } as RecognitionInstance;
  }

  // Nothing supported
  return {
    type: 'none',
    isSupported: false,
    start: async () => { throw new Error('No speech recognition available'); },
    stop: () => { /* no-op */ }
  };
}
