import type { Role } from '@/types';

const ROLE_LABELS: Record<Role, string> = {
  user: 'Client',
  admin: 'Administrateur',
  supplier: 'Fournisseur',
};

export function roleLabel(role: Role): string {
  return ROLE_LABELS[role] ?? role;
}
