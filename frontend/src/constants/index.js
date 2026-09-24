/** Mirrors Entities/ReactionType.cs */
export const ReactionType = Object.freeze({
  Like: 1,
  Dislike: 2,
});

/** Mirrors Entities/UserRole.cs — serialised as a string by the backend. */
export const UserRole = Object.freeze({
  User: 'User',
  Admin: 'Admin',
});

/** Mirrors FileUploadService.cs */
export const UPLOAD = Object.freeze({
  maxFileSizeBytes: 5 * 1024 * 1024,
  acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  acceptAttribute: 'image/jpeg,image/png,image/webp',
});

/** Mirrors the ASP.NET Identity password policy defaults. */
export const PASSWORD_MIN_LENGTH = 6;
