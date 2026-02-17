// Define the base URL for the backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Ensure the base URL doesn't end with a slash to prevent double slashes in the final URL
const normalizedBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  // Ensure the endpoint starts with a slash for proper URL construction
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Construct the full URL
  const fullUrl = `${normalizedBaseUrl}${normalizedEndpoint}`;

  // Validate the URL before making the request
  try {
    new URL(fullUrl);
  } catch (urlError) {
    throw new Error(`Invalid API URL: ${fullUrl}. Please check your environment configuration.`);
  }

  try {
    // Log for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log("apiRequest URL:", fullUrl);
      console.log("apiRequest options:", options);
    }

    // Prepare the request with proper configuration
    const fetchOptions: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",  // Helps identify AJAX requests
        ...(options.headers || {}),
      },
      credentials: "include",  // Include cookies for CSRF protection if needed
    };

    // Make the fetch request with error handling
    const response = await fetch(fullUrl, fetchOptions);

    // Log response status for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log("apiRequest Response Status:", response.status);
    }

    if (!response.ok) {
      // Attempt to get error details from response
      let errorDetails: any = {};
      try {
        errorDetails = await response.json();
      } catch (parseError) {
        // If response is not JSON, try to get text
        try {
          errorDetails = { message: await response.text() };
        } catch (textError) {
          // If we can't get text either, use generic message
          errorDetails = { message: `Request failed with status ${response.status}` };
        }
      }

      throw new Error(errorDetails.message || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API connection failed:", error);
    console.error("Attempted URL:", fullUrl);

    // Differentiate between network errors and other errors
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('network'))) {
      // Network error - likely connectivity issue
      throw new Error(
        `Network error: Unable to connect to authentication server at ${normalizedBaseUrl}. Please check your internet connection and ensure the backend is running and accessible.`
      );
    } else if (error instanceof Error) {
      // Other error - likely HTTP error or parsing issue
      throw new Error(
        `API request failed: ${error.message}. URL: ${fullUrl}. Please try again.`
      );
    } else {
      // Unknown error type
      throw new Error(
        `An unexpected error occurred while connecting to the authentication server at ${fullUrl}. Please try again.`
      );
    }
  }
}