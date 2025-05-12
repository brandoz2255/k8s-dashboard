"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import {
  CalendarIcon,
  Clock,
  CheckSquare,
  Plus,
  Trash2,
  Edit,
  Timer,
  Play,
  Pause,
  RefreshCw,
  Save,
  X,
  Bell,
  PlusCircle,
  AlarmClock,
  Settings,
  ChevronDown,
} from "lucide-react"

// Todo item type
interface TodoItem {
  id: string
  text: string
  completed: boolean
  date: string
}

// Calendar event type
interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  category: "meeting" | "reminder" | "deadline" | "personal"
}

// Timer preset type
interface TimerPreset {
  id: string
  name: string
  focusTime: number
  breakTime: number
}

export default function CalendarPage() {
  // State for todo list
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: "1", text: "Update container security policies", completed: false, date: "2023-04-20" },
    { id: "2", text: "Review system logs", completed: true, date: "2023-04-19" },
    { id: "3", text: "Backup database", completed: false, date: "2023-04-21" },
    { id: "4", text: "Update firewall rules", completed: false, date: "2023-04-22" },
  ])
  const [newTodo, setNewTodo] = useState("")
  const [editingTodo, setEditingTodo] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  // State for calendar
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Security team meeting",
      date: "2023-04-20",
      time: "10:00 AM",
      category: "meeting",
    },
    {
      id: "2",
      title: "System maintenance",
      date: "2023-04-22",
      time: "2:00 PM",
      category: "reminder",
    },
    {
      id: "3",
      title: "Quarterly security review",
      date: "2023-04-25",
      time: "11:00 AM",
      category: "deadline",
    },
  ])

  // State for clock
  const [currentTime, setCurrentTime] = useState(new Date())

  // State for stopwatch
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)

  // State for timer
  const [timerMinutes, setTimerMinutes] = useState(25)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerType, setTimerType] = useState<"focus" | "break">("focus")
  const [showTimerPresets, setShowTimerPresets] = useState(false)
  const [customMinutes, setCustomMinutes] = useState<number | "">("")

  // Timer presets
  const timerPresets: TimerPreset[] = [
    { id: "pomodoro", name: "Pomodoro", focusTime: 25, breakTime: 5 },
    { id: "short", name: "Short Session", focusTime: 15, breakTime: 3 },
    { id: "long", name: "Long Session", focusTime: 45, breakTime: 10 },
    { id: "ultraFocus", name: "Ultra Focus", focusTime: 60, breakTime: 15 },
    { id: "custom", name: "Custom", focusTime: 0, breakTime: 0 },
  ]

  // State for notifications
  const [notifications, setNotifications] = useState<
    { id: string; message: string; type: "todo" | "event" | "reminder" }[]
  >([
    { id: "1", message: "New todo: Update security protocols", type: "todo" },
    { id: "2", message: "Meeting reminder: Team standup at 10:00 AM", type: "reminder" },
  ])

  // State for adding events
  const [showEventForm, setShowEventForm] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "12:00",
    category: "meeting" as "meeting" | "reminder" | "deadline" | "personal",
  })

  // Audio for timer completion
  const timerAudioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element
  useEffect(() => {
    timerAudioRef.current = new Audio("/notification.mp3") // You would need to add this file to your public folder
    return () => {
      if (timerAudioRef.current) {
        timerAudioRef.current.pause()
        timerAudioRef.current = null
      }
    }
  }, [])

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Stopwatch functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 10)
      }, 10)
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTimerRunning) {
      interval = setInterval(() => {
        if (timerSeconds === 0) {
          if (timerMinutes === 0) {
            // Timer completed
            setIsTimerRunning(false)
            // Add notification
            const newNotification = {
              id: Date.now().toString(),
              message: `${timerType === "focus" ? "Focus" : "Break"} timer completed!`,
              type: "reminder" as const,
            }
            setNotifications([newNotification, ...notifications])

            // Play audio
            if (timerAudioRef.current) {
              timerAudioRef.current.play()
            }
          } else {
            setTimerMinutes(timerMinutes - 1)
            setTimerSeconds(59)
          }
        } else {
          setTimerSeconds(timerSeconds - 1)
        }
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, timerMinutes, timerSeconds, timerType, notifications])

  // Format time for stopwatch display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time % 60000) / 1000)
    const milliseconds = Math.floor((time % 1000) / 10)

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds
      .toString()
      .padStart(2, "0")}`
  }

  // Todo list functions
  const addTodo = () => {
    if (newTodo.trim() === "") return

    const newItem: TodoItem = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      date: new Date().toISOString().split("T")[0],
    }

    setTodos([...todos, newItem])
    setNewTodo("")
  }

  // Add todo with notification
  const addTodoWithNotification = () => {
    if (newTodo.trim() === "") return

    const newItem: TodoItem = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      date: new Date().toISOString().split("T")[0],
    }

    setTodos([...todos, newItem])
    setNewTodo("")

    // Add notification
    const newNotification = {
      id: Date.now().toString(),
      message: `New todo added: ${newTodo}`,
      type: "todo" as const,
    }
    setNotifications([newNotification, ...notifications])
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const startEditing = (id: string, text: string) => {
    setEditingTodo(id)
    setEditText(text)
  }

  const saveEdit = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: editText } : todo)))
    setEditingTodo(null)
  }

  // Calendar functions
  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const renderCalendar = () => {
    const days = daysInMonth(currentDate)
    const firstDay = firstDayOfMonth(currentDate)
    const calendarDays = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-10 bg-cyan-950/10 rounded-md opacity-30"></div>)
    }

    // Add cells for each day of the month
    for (let i = 1; i <= days; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      const dateString = date.toISOString().split("T")[0]
      const isToday =
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear()
      const isSelected =
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      const hasEvents = events.some((event) => event.date === dateString)

      calendarDays.push(
        <div
          key={`day-${i}`}
          onClick={() => setSelectedDate(date)}
          className={`h-10 flex flex-col items-center justify-center rounded-md cursor-pointer transition-colors relative ${isToday ? "bg-cyan-900/50 text-cyan-300" : isSelected ? "bg-cyan-950 text-cyan-400" : "hover:bg-cyan-950/30"
            }`}
        >
          <span className="text-sm">{i}</span>
          {hasEvents && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-pink-500"></div>}
        </div>,
      )
    }

    return calendarDays
  }

  // Stopwatch functions
  const startStopwatch = () => {
    if (!isRunning) {
      setIsRunning(true)
      setStartTime(Date.now() - elapsedTime)
    }
  }

  const pauseStopwatch = () => {
    setIsRunning(false)
  }

  const resetStopwatch = () => {
    setIsRunning(false)
    setElapsedTime(0)
  }

  // Timer functions
  const startTimer = () => {
    setIsTimerRunning(true)
  }

  const pauseTimer = () => {
    setIsTimerRunning(false)
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    if (timerType === "focus") {
      setTimerMinutes(25)
      setTimerSeconds(0)
    } else {
      setTimerMinutes(5)
      setTimerSeconds(0)
    }
  }

  const switchTimerType = () => {
    setIsTimerRunning(false)
    if (timerType === "focus") {
      setTimerType("break")
      setTimerMinutes(5)
      setTimerSeconds(0)
    } else {
      setTimerType("focus")
      setTimerMinutes(25)
      setTimerSeconds(0)
    }
  }

  // Function to add a new event
  const handleAddEvent = () => {
    if (newEvent.title.trim() === "") return

    const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`

    const newEventObj: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: dateString,
      time: newEvent.time,
      category: newEvent.category,
    }

    setEvents([...events, newEventObj])
    setNewEvent({
      title: "",
      time: "12:00",
      category: "meeting",
    })
    setShowEventForm(false)

    // Add notification
    const newNotification = {
      id: Date.now().toString(),
      message: `New event added: ${newEvent.title} on ${new Date(dateString).toLocaleDateString()}`,
      type: "event" as const,
    }
    setNotifications([newNotification, ...notifications])
  }

  // Function to dismiss notification
  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  // Function to apply a timer preset
  const applyTimerPreset = (preset: TimerPreset) => {
    setIsTimerRunning(false)
    if (preset.name === "Custom") {
      // If custom, use the value from the custom input
      if (typeof customMinutes === "number") {
        setTimerMinutes(customMinutes)
        setTimerSeconds(0)
      } else {
        // Handle the case where customMinutes is not a valid number
        alert("Please enter a valid number for custom minutes.")
        return
      }
    } else {
      setTimerMinutes(preset.focusTime)
      setTimerSeconds(0)
    }
    setTimerType("focus")
    setShowTimerPresets(false)
  }

  return (
    <div className="flex h-screen bg-black text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-cyan-400">Calendar & Tasks</h1>
            <div className="text-lg font-medium text-cyan-300">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calendar Section */}
            <div className="md:col-span-2 bg-black border border-cyan-950 rounded-lg overflow-hidden hover-card-glow">
              <div className="p-4 border-b border-cyan-950 flex justify-between items-center">
                <h2 className="text-lg font-medium text-cyan-400 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-cyan-400" />
                  Calendar
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevMonth}
                    className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 p-1 rounded transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <span className="text-sm font-medium">
                    {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                  <button
                    onClick={nextMonth}
                    className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 p-1 rounded transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-4">
                {/* Calendar header - days of week */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

                {/* Notifications */}
                <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
                  <AnimatePresence>
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: -20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        className={`p-3 rounded-lg shadow-lg border ${notification.type === "todo"
                          ? "bg-cyan-950/90 border-cyan-700"
                          : notification.type === "event"
                            ? "bg-pink-950/90 border-pink-700"
                            : "bg-emerald-950/90 border-emerald-700"
                          }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            {notification.type === "todo" ? (
                              <CheckSquare className="h-5 w-5 text-cyan-400 mr-2" />
                            ) : notification.type === "event" ? (
                              <CalendarIcon className="h-5 w-5 text-pink-400 mr-2" />
                            ) : (
                              <Bell className="h-5 w-5 text-emerald-400 mr-2" />
                            )}
                            <span className="text-white text-sm">{notification.message}</span>
                          </div>
                          <button
                            onClick={() => dismissNotification(notification.id)}
                            className="text-gray-400 hover:text-white"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Events for selected date */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-cyan-400 mb-2">
                    Events for{" "}
                    {selectedDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h3>
                  <div className="space-y-2">
                    {events
                      .filter(
                        (event) =>
                          event.date ===
                          `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(
                            2,
                            "0",
                          )}-${String(selectedDate.getDate()).padStart(2, "0")}`,
                      )
                      .map((event) => (
                        <div
                          key={event.id}
                          className={`p-2 rounded-md text-sm ${event.category === "meeting"
                            ? "bg-cyan-950/30 border-l-4 border-cyan-500"
                            : event.category === "reminder"
                              ? "bg-emerald-950/30 border-l-4 border-emerald-500"
                              : event.category === "deadline"
                                ? "bg-pink-950/30 border-l-4 border-pink-500"
                                : "bg-violet-950/30 border-l-4 border-violet-500"
                            }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{event.title}</span>
                            <span className="text-xs">{event.time}</span>
                          </div>
                        </div>
                      ))}
                    {events.filter(
                      (event) =>
                        event.date ===
                        `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(
                          2,
                          "0",
                        )}-${String(selectedDate.getDate()).padStart(2, "0")}`,
                    ).length === 0 && (
                        <div className="text-sm text-gray-500 text-center py-2">No events for this day</div>
                      )}
                  </div>
                </div>

                {/* Add Event Button */}
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => setShowEventForm(!showEventForm)}
                    className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-2 py-1 rounded-md text-xs flex items-center transition-colors"
                  >
                    <PlusCircle className="h-3 w-3 mr-1" />
                    Add Event
                  </button>
                </div>

                {/* Add Event Form */}
                <AnimatePresence>
                  {showEventForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 bg-cyan-950/20 border border-cyan-950 rounded-md p-3 overflow-hidden"
                    >
                      <h4 className="text-xs font-medium text-cyan-400 mb-2">
                        Add Event for {selectedDate.toLocaleDateString()}
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Title</label>
                          <input
                            type="text"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            className="w-full bg-cyan-950/30 border border-cyan-950 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            placeholder="Event title"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">Time</label>
                            <input
                              type="time"
                              value={newEvent.time}
                              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                              className="w-full bg-cyan-950/30 border border-cyan-950 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">Category</label>
                            <select
                              value={newEvent.category}
                              onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as any })}
                              className="w-full bg-cyan-950/30 border border-cyan-950 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            >
                              <option value="meeting">Meeting</option>
                              <option value="reminder">Reminder</option>
                              <option value="deadline">Deadline</option>
                              <option value="personal">Personal</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={() => setShowEventForm(false)}
                            className="bg-cyan-950/50 hover:bg-cyan-900 text-cyan-400 px-2 py-1 rounded-md text-xs transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleAddEvent}
                            className="bg-cyan-500 hover:bg-cyan-600 text-black px-2 py-1 rounded-md text-xs transition-colors"
                          >
                            Add Event
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Todo List Section */}
            <div className="bg-black border border-cyan-950 rounded-lg overflow-hidden hover-card-glow">
              <div className="p-4 border-b border-cyan-950 flex justify-between items-center">
                <h2 className="text-lg font-medium text-cyan-400 flex items-center">
                  <CheckSquare className="h-5 w-5 mr-2 text-cyan-400" />
                  Todo List
                </h2>
              </div>

              <div className="p-4">
                <div className="flex mb-4">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-1 bg-cyan-950/20 border border-cyan-950 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addTodoWithNotification()
                    }}
                  />
                  <button
                    onClick={addTodoWithNotification}
                    className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-3 py-2 rounded-r-md text-sm flex items-center transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {todos.map((todo) => (
                    <div key={todo.id} className="bg-cyan-950/10 rounded-md p-2 flex items-start justify-between group">
                      {editingTodo === todo.id ? (
                        <div className="flex-1 flex items-center">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 bg-cyan-950/30 border border-cyan-950 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(todo.id)
                              if (e.key === "Escape") setEditingTodo(null)
                            }}
                          />
                          <button
                            onClick={() => saveEdit(todo.id)}
                            className="ml-2 bg-cyan-950 hover:bg-cyan-900 text-cyan-400 p-1 rounded transition-colors"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingTodo(null)}
                            className="ml-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-400 p-1 rounded transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start flex-1">
                            <div
                              className={`flex-shrink-0 w-5 h-5 rounded border ${todo.completed ? "bg-cyan-500 border-cyan-600" : "bg-transparent border-cyan-950"
                                } mr-2 cursor-pointer flex items-center justify-center`}
                              onClick={() => toggleTodo(todo.id)}
                            >
                              {todo.completed && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 text-black"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <div
                                className={`text-sm ${todo.completed ? "line-through text-gray-500" : "text-gray-300"}`}
                              >
                                {todo.text}
                              </div>
                              <div className="text-xs text-gray-500">{todo.date}</div>
                            </div>
                          </div>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEditing(todo.id, todo.text)}
                              className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 p-1 rounded transition-colors"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => deleteTodo(todo.id)}
                              className="bg-pink-950/50 hover:bg-pink-900 text-pink-400 p-1 rounded transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {todos.length === 0 && (
                    <div className="text-center text-gray-500 py-4">No tasks yet. Add one above!</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Clock and Stopwatch Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Clock Widget */}
            <div className="bg-black border border-cyan-950 rounded-lg overflow-hidden hover-card-glow">
              <div className="p-4 border-b border-cyan-950 flex justify-between items-center">
                <h2 className="text-lg font-medium text-cyan-400 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-cyan-400" />
                  Clock
                </h2>
              </div>

              <div className="p-6 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-cyan-400 mb-4">
                  {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </div>
                <div className="grid grid-cols-3 gap-4 w-full">
                  <div className="bg-cyan-950/20 p-3 rounded-md text-center">
                    <div className="text-xs text-gray-400">Local Time</div>
                    <div className="text-sm font-medium">
                      {currentTime.toLocaleTimeString([], { timeZoneName: "short" })}
                    </div>
                  </div>
                  <div className="bg-cyan-950/20 p-3 rounded-md text-center">
                    <div className="text-xs text-gray-400">UTC</div>
                    <div className="text-sm font-medium">
                      {new Date(currentTime).toLocaleTimeString([], {
                        timeZone: "UTC",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="bg-cyan-950/20 p-3 rounded-md text-center">
                    <div className="text-xs text-gray-400">Date</div>
                    <div className="text-sm font-medium">
                      {currentTime.toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stopwatch Widget */}
            <div className="bg-black border border-cyan-950 rounded-lg overflow-hidden hover-card-glow">
              <div className="p-4 border-b border-cyan-950 flex justify-between items-center">
                <h2 className="text-lg font-medium text-cyan-400 flex items-center">
                  <Timer className="h-5 w-5 mr-2 text-cyan-400" />
                  Stopwatch
                </h2>
              </div>

              <div className="p-6 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-cyan-400 mb-6 font-mono">{formatTime(elapsedTime)}</div>
                <div className="flex space-x-4">
                  {!isRunning ? (
                    <button
                      onClick={startStopwatch}
                      className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-4 py-2 rounded-md flex items-center transition-colors"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </button>
                  ) : (
                    <button
                      onClick={pauseStopwatch}
                      className="bg-pink-950/50 hover:bg-pink-900 text-pink-400 px-4 py-2 rounded-md flex items-center transition-colors"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </button>
                  )}
                  <button
                    onClick={resetStopwatch}
                    className="bg-cyan-950/50 hover:bg-cyan-900 text-cyan-400 px-4 py-2 rounded-md flex items-center transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Timer Widget */}
            <div className="bg-black border border-cyan-950 rounded-lg overflow-hidden hover-card-glow">
              <div className="p-4 border-b border-cyan-950 flex justify-between items-center">
                <h2 className="text-lg font-medium text-cyan-400 flex items-center">
                  <AlarmClock className="h-5 w-5 mr-2 text-cyan-400" />
                  {timerType === "focus" ? "Focus Timer" : "Break Timer"}
                </h2>
                <div className="relative">
                  <div
                    onClick={() => setShowTimerPresets(!showTimerPresets)}
                    className="bg-cyan-950/30 hover:bg-cyan-900 text-cyan-400 px-2 py-1 rounded text-xs transition-colors flex items-center cursor-pointer"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Presets
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                  <AnimatePresence>
                    {showTimerPresets && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-cyan-900 border border-cyan-700 rounded-md shadow-md z-10"
                      >
                        {timerPresets.map((preset) => (
                          <div
                            key={preset.id}
                            onClick={() => applyTimerPreset(preset)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-cyan-800 transition-colors cursor-pointer"
                          >
                            {preset.name}
                          </div>
                        ))}
                        <div className="px-4 py-2">
                          <label className="block text-gray-400 text-xs mb-1">Custom Minutes:</label>
                          <input
                            type="number"
                            value={customMinutes}
                            onChange={(e) => setCustomMinutes(Number(e.target.value))}
                            placeholder="Minutes"
                            className="w-full bg-cyan-950/30 border border-cyan-950 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="p-6 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-cyan-400 mb-6 font-mono">
                  {String(timerMinutes).padStart(2, "0")}:{String(timerSeconds).padStart(2, "0")}
                </div>
                <div className="flex space-x-4">
                  {!isTimerRunning ? (
                    <button
                      onClick={startTimer}
                      className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-4 py-2 rounded-md flex items-center transition-colors"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </button>
                  ) : (
                    <button
                      onClick={pauseTimer}
                      className="bg-pink-950/50 hover:bg-pink-900 text-pink-400 px-4 py-2 rounded-md flex items-center transition-colors"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </button>
                  )}
                  <button
                    onClick={resetTimer}
                    className="bg-cyan-950/50 hover:bg-cyan-900 text-cyan-400 px-4 py-2 rounded-md flex items-center transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </button>
                </div>
                <div className="mt-4 text-xs text-gray-400">
                  {timerType === "focus"
                    ? "Focus on your tasks. Take a break when the timer ends."
                    : "Take a short break. Get back to work when the timer ends."}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

