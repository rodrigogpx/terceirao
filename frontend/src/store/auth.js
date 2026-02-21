// src/store/auth.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuth: false,
      permissions: {},
      setAuth: (user, token) => set({ user, token, isAuth: true }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuth: false }),
      isSA: () => get().user?.role === 'SUPERADMIN',
      isAdmin: () => ['SUPERADMIN','ADMIN'].includes(get().user?.role),
      setUserPermissions: (userId, perms) => {
        const next = { ...(get().permissions || {}) }
        if (!userId) return
        next[userId] = Array.from(new Set(perms || []))
        set({ permissions: next })
      },
      can: (perm) => {
        const u = get().user
        if (!u) return false
        if (u.role === 'SUPERADMIN') return true
        const list = get().permissions?.[u.id] || []
        return list.includes(perm)
      },
    }),
    { name: 'pantera-auth', partialize: s => ({ user: s.user, token: s.token, isAuth: s.isAuth, permissions: s.permissions }) }
  )
)
