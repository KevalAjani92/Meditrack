import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// let isRefreshing = false;

// let failedQueue: {
//   resolve: (value?: unknown) => void;
//   reject: (reason?: any) => void;
// }[] = [];

// const processQueue = (error: any) => {
//   failedQueue.forEach((prom) => {
//     if (error) prom.reject(error);
//     else prom.resolve(null);
//   });

//   failedQueue = [];
// };

apiClient.interceptors.response.use(
  (response) => {
    // console.log("Response:"+response);
    if (response.config.responseType === 'arraybuffer' || response.config.responseType === 'blob') {
      return response; 
    }

    const data = response.data;
    // console.log(data);
    
    if (!data.success) {
      return Promise.reject(data);
    }

    return response.data;
  },
  (error) => {
    // 3. THIS is where HTTP 400/500 errors end up.
    // The backend's actual JSON response is in error.response.data
    console.error(
      "Axios Interceptor Error:", 
      error.response?.data || error.message
    );
    
    // Pass the actual backend error forward to the try/catch blocks
    return Promise.reject(error.response?.data || error);
  }
  // (error) => {
    
  //   const status = error.response?.status || error.status;
  //   const requestUrl = error.config?.url;
    
  //   if (status === 401 && requestUrl !== "/auth/me") {
  //     if (typeof window !== "undefined") {
  //       const path = window.location.pathname;

  //       if (!path.startsWith("/auth")) {
  //         window.location.href = "/auth/login";
  //       }
  //     }
  //   }

  //   return Promise.reject(error);
  // },
  // async (error) => {
  //   const originalRequest = error.config;

  //   const isAuthRoute = originalRequest?.url?.includes("/auth/");

  //   if (
  //     error.response?.status === 401 &&
  //     !originalRequest?._retry &&
  //     !isAuthRoute
  //   ) {
  //     if (isRefreshing) {
  //       return new Promise((resolve, reject) => {
  //         failedQueue.push({
  //           resolve: () => resolve(apiClient(originalRequest)),
  //           reject,
  //         });
  //       });
  //     }

  //     originalRequest._retry = true;
  //     isRefreshing = true;

  //     try {
  //       await apiClient.post("/auth/refresh");

  //       processQueue(null);

  //       return apiClient(originalRequest);
  //     } catch (refreshError) {
  //       processQueue(refreshError);

  //       if (typeof window !== "undefined") {
  //         const path = window.location.pathname;

  //         if (!path.startsWith("/auth")) {
  //           window.location.href = "/auth/login";
  //         }
  //       }

  //       return Promise.reject(refreshError);
  //     } finally {
  //       isRefreshing = false;
  //     }
  //   }

  //   return Promise.reject(error?.response?.data || error);
  // }
);
