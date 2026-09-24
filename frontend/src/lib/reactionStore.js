const STORAGE_KEY = 'professor.myReactions';

/**
 * The backend exposes reaction *counts* but no "what did I react with?" endpoint,
 * so we remember the current user's own choice locally to keep the Like/Dislike
 * buttons highlighted across reloads. Keyed by user so a shared browser doesn't
 * leak one person's reactions into another's UI.
 *
 * If a `GET /api/videos/{id}/reaction/my` endpoint is ever added, delete this
 * module and read the value from the server instead.
 */
function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) ?? {}) : {};
  } catch {
    return {};
  }
}

function writeAll(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* storage unavailable — highlight just won't survive a reload */
  }
}

function keyFor(userId, videoId) {
  return `${userId ?? 'anonymous'}:${videoId}`;
}

export const reactionStore = {
  get(userId, videoId) {
    return readAll()[keyFor(userId, videoId)] ?? null;
  },

  set(userId, videoId, type) {
    const all = readAll();
    const key = keyFor(userId, videoId);
    if (type === null) {
      delete all[key];
    } else {
      all[key] = type;
    }
    writeAll(all);
  },
};
