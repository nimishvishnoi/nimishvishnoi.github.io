import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';

export interface AppState {
  isMobileNavOpen: boolean;
  isLoading: boolean;
  isFormSubmitting: boolean;
  isAdmin: boolean;
  adminPanelOpen: boolean;
  selectedLanguage: string;
  error: AppError | null;
  successMessage: string | null;
}

export interface AppError {
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: number;
}

export type AppAction =
  | { type: 'TOGGLE_MOBILE_NAV' }
  | { type: 'SET_MOBILE_NAV'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FORM_SUBMITTING'; payload: boolean }
  | { type: 'SET_ADMIN'; payload: boolean }
  | { type: 'TOGGLE_ADMIN_PANEL' }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'SET_ERROR'; payload: AppError | null }
  | { type: 'SET_SUCCESS_MESSAGE'; payload: string | null }
  | { type: 'CLEAR_MESSAGES' };

const initialState: AppState = {
  isMobileNavOpen: false,
  isLoading: false,
  isFormSubmitting: false,
  isAdmin: false,
  adminPanelOpen: false,
  selectedLanguage: 'en',
  error: null,
  successMessage: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TOGGLE_MOBILE_NAV':
      return { ...state, isMobileNavOpen: !state.isMobileNavOpen };
    case 'SET_MOBILE_NAV':
      return { ...state, isMobileNavOpen: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_FORM_SUBMITTING':
      return { ...state, isFormSubmitting: action.payload };
    case 'SET_ADMIN':
      return { ...state, isAdmin: action.payload };
    case 'TOGGLE_ADMIN_PANEL':
      return { ...state, adminPanelOpen: !state.adminPanelOpen };
    case 'SET_LANGUAGE':
      return { ...state, selectedLanguage: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SUCCESS_MESSAGE':
      return { ...state, successMessage: action.payload };
    case 'CLEAR_MESSAGES':
      return { ...state, error: null, successMessage: null };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppState(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}
