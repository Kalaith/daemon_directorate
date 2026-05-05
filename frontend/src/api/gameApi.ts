import type { AxiosResponse } from 'axios';

import { apiClient } from './apiClient';
import { ApiResponse } from './types';
import { clearAuthToken, getAuthState, hasAuthToken, setAuthStorage } from './authStorage';

export const getStoredAuthToken = (): string | null => {
  return getAuthState().token;
};

export const ensureGuestSession = async (force = false): Promise<void> => {
  if (!force && hasAuthToken()) {
    return;
  }

  if (force) {
    clearAuthToken();
  }

  const guestSession = await createGuestSession();
  setAuthStorage(guestSession.token, guestSession.user);
};

export interface BackendUser {
  id: string;
  email: string | null;
  username: string;
  display_name: string;
  roles?: string[];
  is_guest?: boolean;
  auth_type?: string;
}

export interface BackendGamePayload {
  [key: string]: unknown;
}

export interface BackendLoadPayload {
  user: BackendUser;
  game_state: BackendGamePayload | null;
  updated_at?: string | null;
}

export interface BackendGuestSessionPayload {
  token: string;
  user: BackendUser;
}

export interface BackendLinkGuestPayload {
  merged: boolean;
  game_state: BackendGamePayload;
}

export const getLoginInfo = async (): Promise<{ login_url: string }> => {
  const response: AxiosResponse<ApiResponse<{ login_url: string }>> =
    await apiClient.get('/api/auth/login-info');

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Unable to load login information.');
  }

  return response.data.data;
};

export const createGuestSession = async (): Promise<BackendGuestSessionPayload> => {
  const response: AxiosResponse<ApiResponse<BackendGuestSessionPayload>> =
    await apiClient.post('/api/auth/guest-session', {});

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Unable to create guest session.');
  }

  return response.data.data;
};

export const linkGuestSession = async (guestToken: string): Promise<BackendLinkGuestPayload> => {
  const response: AxiosResponse<ApiResponse<BackendLinkGuestPayload>> =
    await apiClient.post('/api/auth/link-guest', { guest_token: guestToken });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Unable to link guest session.');
  }

  return response.data.data;
};

export const loadGameState = async (): Promise<BackendGamePayload> => {
  const response: AxiosResponse<ApiResponse<BackendLoadPayload>> = await apiClient.get('/api/game');

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Unable to load game state.');
  }

  return response.data.data.game_state || {};
};

export const startNewGame = async (
  payload: BackendGamePayload = {}
): Promise<BackendGamePayload> => {
  const response: AxiosResponse<ApiResponse<BackendLoadPayload>> =
    await apiClient.post('/api/game/start', { state: payload });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Unable to start game.');
  }

  return response.data.data.game_state || {};
};

export const persistGameState = async (gameState: BackendGamePayload): Promise<BackendGamePayload> => {
  const response: AxiosResponse<ApiResponse<BackendLoadPayload>> =
    await apiClient.post('/api/game/save', { game_state: gameState });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Unable to save game state.');
  }

  return response.data.data.game_state || {};
};

export const applyGameAction = async (
  actionType: string,
  payload: BackendGamePayload
): Promise<BackendGamePayload> => {
  const response: AxiosResponse<ApiResponse<BackendLoadPayload>> =
    await apiClient.post(`/api/game/action/${actionType}`, payload);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Unable to apply game action.');
  }

  return response.data.data.game_state || {};
};
