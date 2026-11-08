import { createContext, useEffect, useReducer } from "react";
import { BASE_URL } from "../utils/config";

const initialState = {
  user: null,
  loading: true,
  error: null,
};

export const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return { user: action.payload, loading: false, error: null };
    case "LOGIN_FAILURE":
      return { user: null, loading: false, error: action.payload };
    case "AUTH_RESTORED":
      return { user: action.payload, loading: false, error: null };
    case "REGISTER_SUCCESS":
    case "LOGOUT":
      return { user: null, loading: false, error: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const controller = new AbortController();

    const restoreSession = async () => {
      try {
        const response = await fetch(`${BASE_URL}/auth/me`, {
          credentials: "include",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          dispatch({ type: "AUTH_RESTORED", payload: null });
          return;
        }

        const result = await response.json();
        dispatch({ type: "AUTH_RESTORED", payload: result.data || null });
      } catch (error) {
        if (error.name !== "AbortError") {
          dispatch({ type: "AUTH_RESTORED", payload: null });
        }
      }
    };

    restoreSession();
    return () => controller.abort();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
