import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';

export interface AppState {
  isDarkMode: boolean;
  activeSection: string;
  isMobileNavOpen: boolean;
  isLoading: boolean;
  isFormSubmitting: boolean;
  formData: FormState;
  isAdmin: boolean;
  adminPanelOpen: boolean;
  selectedLanguage: string;
  error: AppError | null;
  successMessage: string | null;
}

export interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface AppError {
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: number;
}

export type AppAction =
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_ACTIVE_SECTION'; payload: string }
  | { type: 'TOGGLE_MOBILE_NAV' }
  | { type: 'SET_MOBILE_NAV'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FORM_SUBMITTING'; payload: boolean }
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<FormState> }
  | { type: 'RESET_FORM_DATA' }
  | { type: 'SET_FORM_DATA'; payload: FormState }
  | { type: 'SET_ADMIN'; payload: boolean }
  | { type: 'TOGGLE_ADMIN_PANEL' }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'SET_ERROR'; payload: AppError | null }
  | { type: 'SET_SUCCESS_MESSAGE'; payload: string | null }
  | { type: 'CLEAR_MESSAGES' };

const initialState: AppState = {
  isDarkMode:
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false,
  activeSection: 'home',
  isMobileNavOpen: false,
  isLoading: false,
  isFormSubmitting: false,
  formData: {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  },
  isAdmin: false,
  adminPanelOpen: false,
  selectedLanguage: 'en',
  error: null,
  successMessage: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      return { ...state, isDarkMode: !state.isDarkMode };
    case 'SET_ACTIVE_SECTION':
      return { ...state, activeSection: action.payload };
    case 'TOGGLE_MOBILE_NAV':
      return { ...state, isMobileNavOpen: !state.isMobileNavOpen };
    case 'SET_MOBILE_NAV':
      return { ...state, isMobileNavOpen: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_FORM_SUBMITTING':
      return { ...state, isFormSubmitting: action.payload };
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
      };
    case 'RESET_FORM_DATA':
      return {
        ...state,
        formData: initialState.formData,
      };
    case 'SET_FORM_DATA':
      return { ...state, formData: action.payload };
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
