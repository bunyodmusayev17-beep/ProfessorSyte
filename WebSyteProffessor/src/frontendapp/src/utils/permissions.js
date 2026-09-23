export function isMineOrAdmin(user, ownerId) {
  if (!user) return false;
  if (user.role === "Admin") return true;
  return String(user.id) === String(ownerId);
}
