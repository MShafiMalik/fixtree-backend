/**
 * Safe user fields that can be exposed in public APIs
 * Excludes sensitive fields like password, tokens, verification fields, etc.
 */
export const SAFE_USER_FIELDS = [
  'id',
  'name',
  'email',
  'phone',
  'profileImage',
  'role',
] as const;

/**
 * Returns an array of safe user fields with the specified alias prefix
 * for use in TypeORM query builder select statements
 *
 * @param alias - The alias used for the user relation (e.g., 'user', 'seller.user')
 * @returns Array of field strings like ['user.id', 'user.name', ...]
 *
 */
export function addSafeUserFields(alias: string): string[] {
  return SAFE_USER_FIELDS.map((field) => `${alias}.${field}`);
}
