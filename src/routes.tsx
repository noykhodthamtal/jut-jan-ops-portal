import type { ReactNode } from 'react'
import type { Role } from './roles'
import Dashboard from './pages/Dashboard'
import Documents from './pages/Documents'
import Items from './pages/Items'
import ItemGroups from './pages/ItemGroups'
import ExpenseCategories from './pages/ExpenseCategories'
import PurchaseOrderRules from './pages/PurchaseOrderRules'
import StoreMembers from './pages/StoreMembers'
import Login from './pages/Login'
import Merchants from './pages/system/Merchants'
import Stores from './pages/system/Stores'
import Users from './pages/system/Users'
import SystemDashboard from './pages/system/SystemDashboard'
import Billing from './pages/system/Billing'

export type AppRoute = {
  path: string
  label: string
  roles: Role[]
  group: 'ເຈົ້າຂອງລະບົບ' | 'ຜູ້ຈັດການຮ້ານ'
  component: ReactNode
}

export const appRoutes: AppRoute[] = [
  {
    path: '/login',
    label: 'ເຂົ້າລະບົບ',
    roles: ['SYSTEM_OWNER', 'STORE_MANAGER', 'STORE_STAFF'],
    group: 'ເຈົ້າຂອງລະບົບ',
    component: <Login />,
  },
  {
    path: '/dashboard',
    label: 'ແດັດບອດ',
    roles: ['STORE_MANAGER', 'STORE_STAFF'],
    group: 'ຜູ້ຈັດການຮ້ານ',
    component: <Dashboard />,
  },
  {
    path: '/documents',
    label: 'ເອກະສານ',
    roles: ['STORE_MANAGER', 'STORE_STAFF'],
    group: 'ຜູ້ຈັດການຮ້ານ',
    component: <Documents />,
  },
  {
    path: '/master/items',
    label: 'ວັດຖຸດິບ',
    roles: ['STORE_MANAGER', 'STORE_STAFF'],
    group: 'ຜູ້ຈັດການຮ້ານ',
    component: <Items />,
  },
  {
    path: '/master/item-groups',
    label: 'ກຸ່ມວັດຖຸດິບ',
    roles: ['STORE_MANAGER', 'STORE_STAFF'],
    group: 'ຜູ້ຈັດການຮ້ານ',
    component: <ItemGroups />,
  },
  {
    path: '/master/expense-categories',
    label: 'ໝວດຄ່າໃຊ້ຈ່າຍ',
    roles: ['STORE_MANAGER', 'STORE_STAFF'],
    group: 'ຜູ້ຈັດການຮ້ານ',
    component: <ExpenseCategories />,
  },
  {
    path: '/master/po-rules',
    label: 'ກົດເກນ PO',
    roles: ['STORE_MANAGER', 'STORE_STAFF'],
    group: 'ຜູ້ຈັດການຮ້ານ',
    component: <PurchaseOrderRules />,
  },
  {
    path: '/members',
    label: 'ສະມາຊິກຮ້ານ',
    roles: ['STORE_MANAGER'],
    group: 'ຜູ້ຈັດການຮ້ານ',
    component: <StoreMembers />,
  },
  {
    path: '/system/merchants',
    label: 'ຮ້ານຄ້າ (Merchants)',
    roles: ['SYSTEM_OWNER'],
    group: 'ເຈົ້າຂອງລະບົບ',
    component: <Merchants />,
  },
  {
    path: '/system/stores',
    label: 'ສາຂາ',
    roles: ['SYSTEM_OWNER'],
    group: 'ເຈົ້າຂອງລະບົບ',
    component: <Stores />,
  },
  {
    path: '/system/users',
    label: 'ຜູ້ໃຊ້ & ສະມາຊິກ',
    roles: ['SYSTEM_OWNER'],
    group: 'ເຈົ້າຂອງລະບົບ',
    component: <Users />,
  },
  {
    path: '/system/dashboard',
    label: 'ສະຖິຕິລະບົບ',
    roles: ['SYSTEM_OWNER'],
    group: 'ເຈົ້າຂອງລະບົບ',
    component: <SystemDashboard />,
  },
  {
    path: '/system/billing',
    label: 'ບິລລິ້ງ',
    roles: ['SYSTEM_OWNER'],
    group: 'ເຈົ້າຂອງລະບົບ',
    component: <Billing />,
  },
]
