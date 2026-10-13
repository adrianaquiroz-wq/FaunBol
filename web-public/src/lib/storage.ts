/** Acceso a localStorage protegido: en modo privado o con almacenamiento bloqueado puede lanzar. */
export const safeStorage = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value)
    } catch {
      // ignorar: la preferencia simplemente no se recuerda
    }
  },
}
