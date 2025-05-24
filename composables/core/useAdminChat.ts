import { ref, onMounted, onUnmounted } from "vue"
import { io, type Socket } from "socket.io-client"

export interface AdminChatMessage {
  _id?: string
  message: string
  sender: "USER" | "ADMIN" | "SYSTEM"
  timestamp: Date
  messageId?: string
  fullName?: string
  email?: string
}

export interface ChatRoom {
  chatId: string
  fullName: string
  email: string
  lastMessage: string
  timestamp: Date
  unreadCount: number
  status: "online" | "offline" | "away"
  isTyping: boolean
}

export interface AdminChatState {
  isConnected: boolean
  chatRooms: ChatRoom[]
  activeChatId: string | null
  activeMessages: AdminChatMessage[]
  notifications: any[]
  connectionStatus: "connecting" | "connected" | "disconnected" | "error"
}

export const useAdminChat = () => {
  const socket = ref<Socket | null>(null)
  const state = ref<AdminChatState>({
    isConnected: false,
    chatRooms: [],
    activeChatId: null,
    activeMessages: [],
    notifications: [],
    connectionStatus: "disconnected",
  })

  const connect = () => {
    if (socket.value?.connected) return

    state.value.connectionStatus = "connecting"

    socket.value = io("http://localhost:3000/chat", {
      transports: ["websocket"],
      autoConnect: true,
    })

    socket.value.on("connect", () => {
      console.log("Admin connected to chat server")
      state.value.isConnected = true
      state.value.connectionStatus = "connected"

      // Join admin room
      socket.value?.emit("joinAdminRoom")
    })

    socket.value.on("disconnect", () => {
      console.log("Admin disconnected from chat server")
      state.value.isConnected = false
      state.value.connectionStatus = "disconnected"
    })

    socket.value.on("newChat", (data) => {
      console.log("New chat created:", data)

      const newChatRoom: ChatRoom = {
        chatId: data.chatId,
        fullName: data.fullName,
        email: data.email,
        lastMessage: data.message,
        timestamp: new Date(data.timestamp),
        unreadCount: 1,
        status: "online",
        isTyping: false,
      }

      state.value.chatRooms.unshift(newChatRoom)

      // Add notification
      addNotification({
        type: "new_chat",
        title: "New Chat",
        message: `${data.fullName} started a new conversation`,
        chatId: data.chatId,
        timestamp: new Date(),
      })
    })

    socket.value.on("newChatMessage", (data) => {
      console.log("New chat message:", data)

      // Update chat room
      const chatRoom = state.value.chatRooms.find((room) => room.chatId === data.chatId)
      if (chatRoom) {
        chatRoom.lastMessage = data.message
        chatRoom.timestamp = new Date(data.timestamp)
        chatRoom.unreadCount += 1

        // Move to top
        const index = state.value.chatRooms.indexOf(chatRoom)
        state.value.chatRooms.splice(index, 1)
        state.value.chatRooms.unshift(chatRoom)
      }

      // Add to active messages if this is the active chat
      if (state.value.activeChatId === data.chatId) {
        state.value.activeMessages.push({
          _id: data.messageId,
          message: data.message,
          sender: data.sender,
          timestamp: new Date(data.timestamp),
          fullName: data.fullName,
          email: data.email,
        })
      }

      // Add notification
      addNotification({
        type: "new_message",
        title: "New Message",
        message: `${data.fullName}: ${data.message}`,
        chatId: data.chatId,
        timestamp: new Date(),
      })
    })

    socket.value.on("userTyping", (data) => {
      const chatRoom = state.value.chatRooms.find((room) => room.chatId === data.chatId)
      if (chatRoom) {
        chatRoom.isTyping = data.isTyping
      }
    })

    socket.value.on("userPresence", (data) => {
      const chatRoom = state.value.chatRooms.find((room) => room.chatId === data.chatId)
      if (chatRoom) {
        chatRoom.status = data.status
      }
    })

    socket.value.on("chatRead", (data) => {
      const chatRoom = state.value.chatRooms.find((room) => room.chatId === data.chatId)
      if (chatRoom) {
        chatRoom.unreadCount = 0
      }
    })

    socket.value.on("chatClosed", (data) => {
      console.log("Chat closed:", data)
      const chatRoomIndex = state.value.chatRooms.findIndex((room) => room.chatId === data.chatId)
      if (chatRoomIndex !== -1) {
        state.value.chatRooms.splice(chatRoomIndex, 1)
      }

      if (state.value.activeChatId === data.chatId) {
        state.value.activeChatId = null
        state.value.activeMessages = []
      }
    })

    socket.value.on("connect_error", (error) => {
      console.error("Admin connection error:", error)
      state.value.connectionStatus = "error"
    })
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }
    state.value.isConnected = false
    state.value.connectionStatus = "disconnected"
  }

  const joinChat = async (chatId: string) => {
    if (!socket.value?.connected) return

    return new Promise((resolve, reject) => {
      socket.value?.emit("joinChat", { chatId }, (response: any) => {
        if (response.success) {
          state.value.activeChatId = chatId

          // Mark as read
          markChatAsRead(chatId)

          resolve(response)
        } else {
          reject(new Error(response.error || "Failed to join chat"))
        }
      })
    })
  }

  const sendMessage = async (chatId: string, message: string) => {
    if (!socket.value?.connected) return

    return new Promise((resolve, reject) => {
      socket.value?.emit(
        "sendMessage",
        {
          chatId,
          message,
          sender: "admin",
        },
        (response: any) => {
          if (response.success) {
            // Add to active messages
            state.value.activeMessages.push({
              _id: response.messageId,
              message,
              sender: "admin",
              timestamp: new Date(),
            })

            // Update chat room
            const chatRoom = state.value.chatRooms.find((room) => room.chatId === chatId)
            if (chatRoom) {
              chatRoom.lastMessage = message
              chatRoom.timestamp = new Date()
            }

            resolve(response)
          } else {
            reject(new Error(response.error || "Failed to send message"))
          }
        },
      )
    })
  }

  const markChatAsRead = (chatId: string) => {
    if (!socket.value?.connected) return

    socket.value.emit("markChatAsRead", { chatId })

    const chatRoom = state.value.chatRooms.find((room) => room.chatId === chatId)
    if (chatRoom) {
      chatRoom.unreadCount = 0
    }
  }

  const closeChat = async (chatId: string) => {
    if (!socket.value?.connected) return

    return new Promise((resolve, reject) => {
      socket.value?.emit("closeChat", { chatId }, (response: any) => {
        if (response.success) {
          resolve(response)
        } else {
          reject(new Error(response.error || "Failed to close chat"))
        }
      })
    })
  }

  const getChatHistory = async (chatId: string, limit = 50, offset = 0) => {
    if (!socket.value?.connected) return

    return new Promise((resolve, reject) => {
      socket.value?.emit(
        "getChatHistory",
        {
          chatId,
          limit,
          offset,
        },
        (response: any) => {
          if (response.success) {
            state.value.activeMessages = response.messages.map((msg: any) => ({
              _id: msg._id,
              message: msg.message,
              sender: msg.sender,
              timestamp: new Date(msg.timestamp),
            }))
            resolve(response)
          } else {
            reject(new Error(response.error || "Failed to get chat history"))
          }
        },
      )
    })
  }

  const addNotification = (notification: any) => {
    state.value.notifications.unshift(notification)

    // Keep only last 50 notifications
    if (state.value.notifications.length > 50) {
      state.value.notifications = state.value.notifications.slice(0, 50)
    }
  }

  const clearNotifications = () => {
    state.value.notifications = []
  }

  const removeNotification = (index: number) => {
    state.value.notifications.splice(index, 1)
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    state: state,
    connect,
    disconnect,
    joinChat,
    sendMessage,
    markChatAsRead,
    closeChat,
    getChatHistory,
    addNotification,
    clearNotifications,
    removeNotification,
  }
}
