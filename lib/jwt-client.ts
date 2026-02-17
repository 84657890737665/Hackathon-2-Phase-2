
'use client';

/**
 * Custom JWT Client
 *
 * Note: This replaces the previous 'better-auth' client implementation
 * to accurately reflect the custom JWT backend architecture.
 */

import { apiRequest } from './api';

// Helper to check if we are in the browser
const isBrowser = typeof window !== 'undefined';

// Function to refresh access token
export const refreshToken = async (): Promise<string | null> => {
    if (!isBrowser) return null;
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
        return null;
    }

    try {
        const result = await apiRequest('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (result.token) {
            return result.token;
        }

        return null;
    } catch (error) {
        console.error('Error refreshing token:', error);
        if (isBrowser) localStorage.removeItem('refreshToken');
        return null;
    }
};

// Secure fetcher with enterprise-grade authentication and error handling
export const secureFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    // If the URL is a relative path, prepend the API base URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const fullUrl = url.startsWith('http') ? url : `${apiUrl}${url}`;

    const token = isBrowser ? localStorage.getItem('accessToken') : null;

    // Create headers with security best practices
    const headers = {
        ...options.headers,
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    };

    try {
        let response = await fetch(fullUrl, {
            ...options,
            headers,
            credentials: 'include'  // Include cookies for CSRF protection if needed
        });

        // Handle 401 Unauthorized (token might be expired)
        if (response.status === 401) {
            const newToken = await refreshToken();
            if (newToken && isBrowser) {
                localStorage.setItem('accessToken', newToken);
                // Retry with new token
                headers['Authorization'] = `Bearer ${newToken}`;
                response = await fetch(fullUrl, {
                    ...options,
                    headers,
                    credentials: 'include'
                });
            }
        }

        // Log security-relevant information (only in development)
        if (process.env.NODE_ENV === 'development') {
            console.log("secureFetch URL:", fullUrl);
            console.log("secureFetch Token:", token ? "Present" : "Missing");
            console.log("secureFetch Response Status:", response.status);
        }

        return response;
    } catch (error) {
        console.error("Network error in secureFetch:", error);
        console.error("Failed to fetch URL:", fullUrl);
        console.error("Error details:", error instanceof Error ? {
            name: error.name,
            message: error.message,
            stack: error.stack
        } : error);

        // Re-throw the error so calling functions can handle it
        throw error;
    }
};

export const signIn = async (formData: any) => {
    try {
        const result = await apiRequest('/auth/signin', {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        if (result.token && isBrowser) {
            localStorage.setItem('accessToken', result.token);
        }
        if (result.refresh_token && isBrowser) {
            localStorage.setItem('refreshToken', result.refresh_token);
        }
        return result;
    } catch (error) {
        console.error('Sign-in API error:', error);
        throw error; // Re-throw to be handled by the calling function
    }
};

export const signUp = async (formData: any) => {
    try {
        const result = await apiRequest('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        return result;
    } catch (error) {
        console.error('Sign-up API error:', error);
        throw error; // Re-throw to be handled by the calling function
    }
};

export const signOut = async () => {
    if (isBrowser) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
    return { success: true };
};

// Decode JWT to get user data
export const getSession = () => {
    if (!isBrowser) return null;
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return { data: { user: { id: payload.user_id, email: payload.email }, expiresAt: payload.exp } };
    } catch (e) {
        return null;
    }
};

export const useSession = () => {
    // This is a simplified version of better-auth's useSession hook
    return getSession();
};

export const authClient = {
    signIn,
    signUp,
    signOut,
    refreshToken,
    secureFetch,
    useSession,
    getSession
};
