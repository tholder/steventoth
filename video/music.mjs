// Original ambient "mountain" soundtrack for the intro video, synthesised from scratch
// (no samples, no licensing). Warm pads, a slow kalimba-style arpeggio, a soft bass
// drone, light rain and wind, and a couple of distant birds. Chord changes follow the
// video's scene cuts, and the reverb tail is wrapped to the start so the loop is seamless.
//
//   node video/music.mjs out.wav   (writes a 44.1 kHz stereo WAV)

import { writeFile } from 'node:fs/promises';

const SR = 44100;
const TAU = Math.PI * 2;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

export function renderMusic(duration = 26) {
  const TAIL = 7;
  const N = Math.ceil((duration + TAIL) * SR);
  const L = new Float32Array(N);
  const R = new Float32Array(N);
  const sendL = new Float32Array(N); // reverb send
  const sendR = new Float32Array(N);

  let seed = 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  // Chords line up with scenes: rainforest, meet Steven, Kits, services, call to action.
  const chords = [
    { at: 0.0, bass: 38, notes: [50, 57, 61, 64, 66], arp: [74, 76, 78, 81, 85] }, // Dmaj9
    { at: 5.1, bass: 35, notes: [47, 54, 57, 61, 62], arp: [71, 73, 74, 78, 81] }, // Bm9
    { at: 10.8, bass: 31, notes: [43, 50, 54, 57, 59], arp: [71, 74, 76, 78, 83] }, // Gmaj9
    { at: 16.8, bass: 40, notes: [52, 59, 62, 66, 67], arp: [71, 74, 76, 79, 83] }, // Em9
    { at: 21.6, bass: 33, notes: [45, 52, 57, 59, 64], arp: [69, 71, 76, 81, 83] }, // Asus2 -> loops to D
  ];
  const chordEnd = (i) => (i + 1 < chords.length ? chords[i + 1].at : duration);

  // Soft saw wavetable (few harmonics = warm, not buzzy)
  const TABLE = 4096;
  const saw = new Float32Array(TABLE);
  for (let i = 0; i < TABLE; i++) {
    let v = 0;
    for (let h = 1; h <= 7; h++) v += Math.sin((TAU * h * i) / TABLE) / (h * h * 0.6 + 0.4);
    saw[i] = v * 0.5;
  }

  // --- Pads: three detuned voices per note, slow swell, gentle low-pass
  chords.forEach((c, ci) => {
    const t0 = c.at - 0.6;
    const t1 = chordEnd(ci) + 0.6;
    const atk = 2.2;
    const rel = 3.0;
    c.notes.forEach((m, ni) => {
      [-7, 0, 7].forEach((cents, vi) => {
        const f = mtof(m) * Math.pow(2, cents / 1200);
        const pan = vi === 0 ? 0.25 : vi === 2 ? 0.75 : 0.5;
        let ph = rand() * TABLE;
        let lp = 0;
        const start = Math.max(0, Math.floor(t0 * SR));
        const end = Math.min(N, Math.floor((t1 + rel) * SR));
        for (let i = start; i < end; i++) {
          const t = i / SR;
          let env = Math.min(1, (t - t0) / atk);
          if (t > t1) env *= Math.max(0, 1 - (t - t1) / rel);
          env = env * env * (3 - 2 * env); // smoothstep
          ph += (f * TABLE) / SR;
          if (ph >= TABLE) ph -= TABLE;
          const raw = saw[ph | 0];
          const cutoff = 0.1 + 0.035 * Math.sin(TAU * 0.07 * t + ni);
          lp += cutoff * (raw - lp);
          const v = lp * env * 0.04 * (ni === 0 ? 0.6 : 1);
          L[i] += v * (1 - pan);
          R[i] += v * pan;
          sendL[i] += v * (1 - pan) * 0.9;
          sendR[i] += v * pan * 0.9;
        }
      });
    });
  });

  // --- Bass drone: soft sine with a whisper of 2nd harmonic
  chords.forEach((c, ci) => {
    const t0 = c.at - 0.3;
    const t1 = chordEnd(ci) + 0.3;
    const f = mtof(c.bass);
    const start = Math.max(0, Math.floor(t0 * SR));
    const end = Math.min(N, Math.floor((t1 + 1.5) * SR));
    for (let i = start; i < end; i++) {
      const t = i / SR;
      let env = Math.min(1, (t - t0) / 1.2);
      if (t > t1) env *= Math.max(0, 1 - (t - t1) / 1.5);
      const v = (Math.sin(TAU * f * t) + 0.15 * Math.sin(TAU * 2 * f * t)) * env * 0.06;
      L[i] += v;
      R[i] += v;
    }
  });

  // --- Kalimba-like pluck
  const pluck = (time, midi, gain, pan) => {
    const f = mtof(midi);
    const start = Math.floor(time * SR);
    const len = Math.floor(2.6 * SR);
    for (let k = 0; k < len && start + k < N; k++) {
      const t = k / SR;
      const env = Math.min(1, t / 0.004) * Math.exp(-t / 0.75);
      const v =
        (Math.sin(TAU * f * t) + 0.25 * Math.sin(TAU * 2 * f * t) * Math.exp(-t / 0.2) + 0.08 * Math.sin(TAU * 4.2 * f * t) * Math.exp(-t / 0.08)) *
        env *
        gain;
      const i = start + k;
      L[i] += v * (1 - pan);
      R[i] += v * pan;
      sendL[i] += v * (1 - pan) * 1.2;
      sendR[i] += v * pan * 1.2;
    }
  };

  // Opening bells: a sparse falling motif over the rainforest
  [
    [0.9, 78],
    [1.7, 76],
    [2.5, 74],
    [3.6, 81],
    [4.4, 78],
  ].forEach(([t, m]) => pluck(t, m, 0.12, 0.35 + rand() * 0.3));

  // Arpeggio from "Meet Steven" onwards, 8th notes at ~72 bpm, lightly humanised
  const step = 60 / 72 / 2;
  const pattern = [0, 2, 1, 3, 2, 4, 3, 1];
  let n = 0;
  for (let t = 5.1; t < duration - 0.2; t += step, n++) {
    const ci = chords.findLastIndex((c) => c.at <= t + 0.01);
    const c = chords[ci];
    const inFinal = t > 23.6;
    if (inFinal && n % 2) continue; // thin out as it settles for the loop
    const accent = n % 4 === 0 ? 1 : 0.7;
    const gain = 0.1 * accent * (inFinal ? 0.7 : 1);
    pluck(t + (rand() - 0.5) * 0.012, c.arp[pattern[n % pattern.length]], gain, 0.3 + rand() * 0.4);
  }

  // --- Rain and wind: filtered noise, rain strongest in the opening scene
  let lpW = 0;
  let lpR = 0;
  let hpR = 0;
  let lpR2 = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const tw = t % duration;
    const noise = rand() * 2 - 1;
    lpW += 0.004 * (noise - lpW);
    const wind = lpW * (0.55 + 0.45 * Math.sin(TAU * 0.09 * t + 1)) * 1.6;
    lpR += 0.5 * (noise - lpR);
    hpR = lpR - (lpR2 += 0.05 * (lpR - lpR2));
    const rainAmt = 0.35 + 0.65 * Math.min(1, Math.max(0, (6.2 - tw) / 1.6)) * Math.min(1, tw / 0.4 + (t >= duration ? 1 : 0.6));
    const rain = hpR * 0.03 * rainAmt;
    // occasional drops
    const drop = rand() < 0.0009 * rainAmt ? (rand() * 2 - 1) * 0.05 : 0;
    L[i] += wind * 0.05 + rain + drop;
    R[i] += wind * 0.05 * 0.9 + rain * (0.8 + 0.4 * rand()) + drop * 0.6;
  }

  // --- Distant birds in the Kitsilano scene
  const chirp = (time, f0, f1, dur, gain, pan) => {
    const start = Math.floor(time * SR);
    let ph = 0;
    for (let k = 0; k < dur * SR; k++) {
      const p = k / (dur * SR);
      const f = f0 + (f1 - f0) * Math.sin(p * Math.PI * 0.5);
      ph += (TAU * f) / SR;
      const env = Math.sin(Math.PI * p) ** 2;
      const v = Math.sin(ph) * env * gain;
      L[start + k] += v * (1 - pan);
      R[start + k] += v * pan;
      sendL[start + k] += v * (1 - pan) * 2;
      sendR[start + k] += v * pan * 2;
    }
  };
  [11.9, 12.15, 14.6, 14.82, 15.05].forEach((t, i) => chirp(t, 3200 + i * 150, 4300 + i * 120, 0.09, 0.012, i < 2 ? 0.2 : 0.8));

  // --- Freeverb-style reverb on the send bus
  const reverb = (input, offset) => {
    const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((d) => ({ buf: new Float32Array(d + offset), i: 0, store: 0 }));
    const aps = [556, 441, 341, 225].map((d) => ({ buf: new Float32Array(d + offset), i: 0 }));
    const out = new Float32Array(N);
    const fb = 0.86;
    const damp = 0.25;
    for (let n = 0; n < N; n++) {
      const x = input[n] * 0.015;
      let y = 0;
      for (const c of combs) {
        const o = c.buf[c.i];
        c.store = o * (1 - damp) + c.store * damp;
        c.buf[c.i] = x + c.store * fb;
        c.i = (c.i + 1) % c.buf.length;
        y += o;
      }
      for (const a of aps) {
        const b = a.buf[a.i];
        a.buf[a.i] = y + b * 0.5;
        a.i = (a.i + 1) % a.buf.length;
        y = b - y;
      }
      out[n] = y;
    }
    return out;
  };
  const revL = reverb(sendL, 0);
  const revR = reverb(sendR, 23);
  for (let i = 0; i < N; i++) {
    L[i] += revL[i] * 2.2;
    R[i] += revR[i] * 2.2;
  }

  // Wrap the tail onto the start so the loop is seamless, then trim
  const D = Math.floor(duration * SR);
  const outL = L.slice(0, D);
  const outR = R.slice(0, D);
  for (let i = D; i < N; i++) {
    outL[i - D] += L[i];
    outR[i - D] += R[i];
  }

  // Gentle soft-clip and normalise to -3 dBFS
  let peak = 0;
  for (let i = 0; i < D; i++) {
    outL[i] = Math.tanh(outL[i] * 1.2);
    outR[i] = Math.tanh(outR[i] * 1.2);
    peak = Math.max(peak, Math.abs(outL[i]), Math.abs(outR[i]));
  }
  const g = 0.707 / peak;
  for (let i = 0; i < D; i++) {
    outL[i] *= g;
    outR[i] *= g;
  }
  return { L: outL, R: outR, sampleRate: SR };
}

export function toWav({ L, R, sampleRate }) {
  const n = L.length;
  const buf = Buffer.alloc(44 + n * 4);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 4, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), 46 + i * 4);
  }
  return buf;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = process.argv[2] ?? 'music.wav';
  await writeFile(out, toWav(renderMusic()));
  console.log('Wrote', out);
}
