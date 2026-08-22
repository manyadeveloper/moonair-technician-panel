import {
  isValidMockLoginIdentifier,
  isValidMockLoginPassword,
  MOCK_TECHNICIAN,
  resolveDemoTechnician,
} from "@/lib/mock/technicians";
import type { AuthUser } from "@/types/technician";

// TODO: Replace mock authentication with Supabase Auth.
// Supabase will manage password hashing — never store or encode passwords in frontend code.
// Technician profile will link auth.users.id → technicians table.

const SESSION_KEY = "moonair_technician_session";
const AUTH_CHANGE_EVENT = "moonair-auth-change";

let snapshotCache: AuthUser | null = null;
let snapshotRaw: string | null | undefined;

function readSessionRaw(): string | null {
  if (typeof window === "undefined") return null;
  return (
    sessionStorage.getItem(SESSION_KEY) ?? localStorage.getItem(SESSION_KEY)
  );
}

function invalidateAuthSnapshot(): void {
  snapshotRaw = undefined;
}

function emitAuthChange(): void {
  if (typeof window === "undefined") return;
  invalidateAuthSnapshot();
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

function hydrateDemoSession(user: AuthUser): AuthUser {
  if (user.technician?.technician_code !== MOCK_TECHNICIAN.technician_code) {
    return user;
  }

  const technician = resolveDemoTechnician(user.technician);
  const hydrated: AuthUser = {
    ...user,
    email: technician.email,
    technician,
  };

  return JSON.stringify(hydrated) === JSON.stringify(user) ? user : hydrated;
}

function persistSession(user: AuthUser, emit = true): void {
  if (typeof window === "undefined") return;

  const storage = localStorage.getItem(SESSION_KEY)
    ? localStorage
    : sessionStorage;
  storage.setItem(SESSION_KEY, JSON.stringify(user));
  if (emit) emitAuthChange();
}

/** Stable snapshot for useSyncExternalStore — same reference until session changes. */
export function getAuthSnapshot(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = readSessionRaw();
  const normalizedRaw = raw ?? "";

  if (normalizedRaw === snapshotRaw) {
    return snapshotCache;
  }

  snapshotRaw = normalizedRaw;

  if (!raw) {
    snapshotCache = null;
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthUser;
    const hydrated = hydrateDemoSession(parsed);

    if (hydrated !== parsed) {
      snapshotCache = hydrated;
      snapshotRaw = JSON.stringify(hydrated);
      persistSession(hydrated);
      return hydrated;
    }

    snapshotCache = parsed;
  } catch {
    snapshotCache = null;
  }

  return snapshotCache;
}

export function subscribeAuth(listener: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onStoreChange = () => listener();

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(AUTH_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(AUTH_CHANGE_EVENT, onStoreChange);
  };
}

export function getCurrentUser(): AuthUser | null {
  return getAuthSnapshot();
}

export async function login(
  identifier: string,
  password: string,
  remember?: boolean
): Promise<{ user: AuthUser | null; error: string | null }> {
  await new Promise((r) => setTimeout(r, 400));

  if (!isValidMockLoginIdentifier(identifier) || !isValidMockLoginPassword(password)) {
    return { user: null, error: "Invalid technician ID or password." };
  }

  const user: AuthUser = {
    id: MOCK_TECHNICIAN.user_id,
    email: MOCK_TECHNICIAN.email,
    technician: MOCK_TECHNICIAN,
  };

  if (typeof window !== "undefined") {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(user));
    emitAuthChange();
  }

  return { user, error: null };
}

export async function logout(): Promise<void> {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    emitAuthChange();
  }
}

function persistUser(user: AuthUser): void {
  persistSession(user);
}

/** Mock profile update — will connect to Supabase during backend phase. */
export async function updateProfile(
  data: Pick<AuthUser["technician"], "name" | "phone" | "email" | "address">
): Promise<{ user: AuthUser | null; error: string | null }> {
  await new Promise((r) => setTimeout(r, 300));

  const current = getCurrentUser();
  if (!current) {
    return { user: null, error: "Not signed in." };
  }

  const user: AuthUser = {
    ...current,
    email: data.email,
    technician: {
      ...current.technician,
      ...data,
      updated_at: new Date().toISOString(),
    },
  };

  persistUser(user);
  return { user, error: null };
}
