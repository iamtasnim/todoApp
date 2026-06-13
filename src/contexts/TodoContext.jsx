import { createContext, useContext, useReducer, useEffect } from 'react'
import { DEFAULT_CATEGORIES } from '../utils/helpers'

const TodoContext = createContext(null)

function loadState() {
  try {
    const saved = localStorage.getItem('todoAppState')
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        todos: parsed.todos || [],
        categories: parsed.categories || DEFAULT_CATEGORIES,
        darkMode: parsed.darkMode || false,
        nextId: parsed.nextId || 1,
      }
    }
  } catch {}
  return { todos: [], categories: DEFAULT_CATEGORIES, darkMode: false, nextId: 1 }
}

function saveState(state) {
  try {
    localStorage.setItem('todoAppState', JSON.stringify({
      todos: state.todos,
      categories: state.categories,
      darkMode: state.darkMode,
      nextId: state.nextId,
    }))
  } catch {}
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO': {
      const maxOrder = state.todos.reduce((max, t) => Math.max(max, t.order || 0), 0)
      const now = new Date().toISOString()
      const todo = {
        id: state.nextId,
        text: action.payload.text,
        description: action.payload.description || '',
        completed: false,
        priority: action.payload.priority || 'none',
        dueDate: action.payload.dueDate || '',
        category: action.payload.category || '',
        subtasks: [],
        tags: action.payload.tags || [],
        createdAt: now,
        updatedAt: now,
        completedAt: null,
        order: maxOrder + 1,
      }
      return { ...state, todos: [...state.todos, todo], nextId: state.nextId + 1 }
    }

    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.payload.id
            ? { ...t, ...action.payload, updatedAt: new Date().toISOString() }
            : t
        ),
      }

    case 'DELETE_TODO':
      return { ...state, todos: state.todos.filter(t => t.id !== action.payload) }

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.payload
            ? {
                ...t,
                completed: !t.completed,
                completedAt: !t.completed ? new Date().toISOString() : null,
                updatedAt: new Date().toISOString(),
              }
            : t
        ),
      }

    case 'REORDER_TODOS':
      return { ...state, todos: action.payload }

    case 'CLEAR_COMPLETED':
      return { ...state, todos: state.todos.filter(t => !t.completed) }

    case 'ADD_SUBTASK': {
      const now = new Date().toISOString()
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.payload.todoId
            ? {
                ...t,
                subtasks: [
                  ...t.subtasks,
                  {
                    id: Date.now(),
                    text: action.payload.text,
                    completed: false,
                    createdAt: now,
                  },
                ],
                updatedAt: now,
              }
            : t
        ),
      }
    }

    case 'TOGGLE_SUBTASK':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.payload.todoId
            ? {
                ...t,
                subtasks: t.subtasks.map(s =>
                  s.id === action.payload.subtaskId
                    ? { ...s, completed: !s.completed }
                    : s
                ),
                updatedAt: new Date().toISOString(),
              }
            : t
        ),
      }

    case 'DELETE_SUBTASK':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.payload.todoId
            ? { ...t, subtasks: t.subtasks.filter(s => s.id !== action.payload.subtaskId) }
            : t
        ),
      }

    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] }

    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        ),
      }

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload),
        todos: state.todos.map(t =>
          t.category === action.payload ? { ...t, category: '', updatedAt: new Date().toISOString() } : t
        ),
      }

    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode }

    case 'IMPORT_TODOS':
      return { ...state, todos: action.payload, nextId: state.todos.length + 1 }

    default:
      return state
  }
}

export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light')
  }, [state.darkMode])

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  )
}

export function useTodos() {
  const ctx = useContext(TodoContext)
  if (!ctx) throw new Error('useTodos must be used within TodoProvider')
  return ctx
}
