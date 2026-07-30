/**
 * Formats raw bytes/sec into human-readable B/s, KB/s, MB/s, or GB/s with 1 decimal place.
 * Example: 30800358.53 -> "30.8 MB/s"
 */
export function formatSpeed(speed: number | string | null | undefined): string {
  if (speed === null || speed === undefined || speed === '') {
    return '0 B/s';
  }

  if (typeof speed === 'string') {
    if (speed === 'Starting...' || speed === 'N/A' || speed === 'NA') {
      return speed;
    }
    const parsed = parseFloat(speed);
    if (isNaN(parsed)) {
      return speed;
    }
    speed = parsed;
  }

  if (speed <= 0) {
    return '0 B/s';
  }

  if (speed < 1000) {
    return `${speed.toFixed(1)} B/s`;
  }
  if (speed < 1000 * 1000) {
    return `${(speed / 1000).toFixed(1)} KB/s`;
  }
  if (speed < 1000 * 1000 * 1000) {
    return `${(speed / (1000 * 1000)).toFixed(1)} MB/s`;
  }
  return `${(speed / (1000 * 1000 * 1000)).toFixed(1)} GB/s`;
}

/**
 * Formats raw seconds into MM:SS (or HH:MM:SS) format.
 * Example: 65 -> "01:05"
 */
export function formatEta(eta: number | string | null | undefined): string {
  if (eta === null || eta === undefined || eta === '') {
    return '--:--';
  }

  if (typeof eta === 'string') {
    if (eta === 'NA' || eta === 'N/A' || eta === '--:--') {
      return '--:--';
    }
    // Return directly if already formatted as HH:MM:SS or MM:SS
    if (eta.includes(':')) {
      return eta;
    }
    const parsed = parseFloat(eta);
    if (isNaN(parsed)) {
      return '--:--';
    }
    eta = parsed;
  }

  if (eta <= 0) {
    return '00:00';
  }

  const totalSeconds = Math.floor(eta);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const pad = (num: number) => String(num).padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}
