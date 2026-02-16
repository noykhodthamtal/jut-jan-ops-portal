export type Role = 'SYSTEM_OWNER' | 'STORE_MANAGER' | 'STORE_STAFF'

export const roleLabels: Record<Role, string> = {
  SYSTEM_OWNER: 'ເຈົ້າຂອງລະບົບ',
  STORE_MANAGER: 'ເຈົ້າຂອງຮ້ານ / ຜູ້ຈັດການ',
  STORE_STAFF: 'ພະນັກງານຮ້ານ',
}

export const roleOptions: Role[] = [
  'SYSTEM_OWNER',
  'STORE_MANAGER',
  'STORE_STAFF',
]
