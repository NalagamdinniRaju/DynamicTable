import { useEffect, useReducer } from "react"

const STORAGE_KEY = "dynamic-table-state"

const initialState = {
  rows: [{ id: "1", column1: null, column2: [], createdAt: Date.now() }],
  options2: [
    { id: "a", label: "Choice A" },
    { id: "b", label: "Choice B" },
    { id: "c", label: "Choice C" },
    { id: "d", label: "Choice D" },
  ],
}

function tableReducer(state, action) {
  switch (action.type) {
    case "ADD_ROW":
      return {
        ...state,
        rows: [...state.rows, { id: crypto.randomUUID(), column1: null, column2: [], createdAt: Date.now() }],
      }
    case "DELETE_ROW":
      return {
        ...state,
        rows: state.rows.filter((row) => row.id !== action.payload),
      }
    case "UPDATE_ROW":
      return {
        ...state,
        rows: state.rows.map((row) => (row.id === action.payload.id ? { ...row, ...action.payload.updates } : row)),
      }
    case "ADD_OPTION":
      return {
        ...state,
        options2: [...state.options2, action.payload],
      }
    default:
      return state
  }
}

export function useTableState() {
  const [state, dispatch] = useReducer(tableReducer, initialState)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsedState = JSON.parse(saved)
        if (parsedState && typeof parsedState === "object") {
          dispatch({ type: "SET_STATE", payload: parsedState })
        }
      } catch (error) {
        console.error("Error parsing saved state:", error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  return { state, dispatch }
}

