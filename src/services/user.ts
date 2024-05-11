import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface User {
  customClaims?: {
    [key: string]: any;
  };
  disabled: boolean;
  email?: string;
  emailVerified?: boolean;
  uid: string;
  displayName?: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["User"],
  endpoints: (build) => ({
    getUsers: build.query<User[], string>({
      query: (token) => {
        return {
          url: "/users",
          headers: {
            authorization: token,
          },
        };
      },
      providesTags: ["User"],
    }),
    getUser: build.query<User, string>({
      query: (token) => {
        return {
          url: "/user",
          headers: {
            authorization: token,
          },
        };
      },
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery } = userApi;
