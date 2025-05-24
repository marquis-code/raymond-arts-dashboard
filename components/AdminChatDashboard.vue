<template>
    <div class="flex h-screen bg-gray-100 relative">
      <!-- Mobile Overlay -->
      <div 
        v-if="isMobileDrawerOpen" 
        @click="closeMobileDrawer"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      ></div>
  
      <!-- Sidebar - Chat List -->
      <div 
        class="w-full sm:w-80 lg:w-1/3 bg-white border-r border-gray-200 flex flex-col fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out"
        :class="{
          'translate-x-0': isMobileDrawerOpen,
          '-translate-x-full lg:translate-x-0': !isMobileDrawerOpen
        }"
      >
        <!-- Header -->
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-x-3">
              <img src="@/assets/img/raymond-logo.png" class="h-8 w-8 sm:h-10 sm:w-10" />
              <h2 class="text-base sm:text-lg font-semibold">Chat Support</h2>
            </div>
            <div class="flex items-center gap-2">
              <!-- Close button for mobile -->
              <button
                @click="closeMobileDrawer"
                class="lg:hidden p-1 rounded-md hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                </svg>
              </button>
              <div 
                class="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                :class="{
                  'bg-green-500': adminChatState.connectionStatus === 'connected',
                  'bg-yellow-500': adminChatState.connectionStatus === 'connecting',
                  'bg-red-500': adminChatState.connectionStatus === 'error',
                  'bg-gray-500': adminChatState.connectionStatus === 'disconnected'
                }"
              ></div>
              <span class="text-xs sm:text-sm text-gray-600 capitalize">
                {{ adminChatState.connectionStatus }}
              </span>
            </div>
          </div>
          
          <!-- Notifications -->
          <div v-if="adminChatState.notifications.length > 0" class="mt-2">
            <button
              @click="showNotifications = !showNotifications"
              class="flex items-center gap-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" class="sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 256 256">
                <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
              </svg>
              {{ adminChatState.notifications.length }} notifications
            </button>
          </div>
        </div>
        
        <!-- Notifications Panel -->
        <div v-if="showNotifications" class="p-4 bg-blue-50 border-b border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-medium text-sm sm:text-base">Notifications</h3>
            <button
              @click="clearNotifications"
              class="text-xs sm:text-sm text-gray-600 hover:text-gray-800"
            >
              Clear all
            </button>
          </div>
          <div class="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
            <div
              v-for="(notification, index) in adminChatState.notifications.slice(0, 5)"
              :key="index"
              class="p-2 bg-white rounded text-xs sm:text-sm"
            >
              <div class="font-medium">{{ notification.title }}</div>
              <div class="text-gray-600">{{ notification.message }}</div>
              <div class="text-xs text-gray-400 mt-1">
                {{ formatTime(notification.timestamp) }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Chat Rooms List -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="adminChatState.chatRooms.length === 0" class="p-4 mt-12 sm:mt-20 text-center flex justify-center items-center flex-col text-gray-500">
            <img src="@/assets/icons/conversation-illustration.svg" class="w-16 h-16 sm:w-auto sm:h-auto" />
            <p class="text-gray-800 text-sm sm:text-base mt-2">No conversations found</p>
          </div>
          
          <div
            v-for="chatRoom in adminChatState.chatRooms"
            :key="chatRoom.chatId"
            @click="selectChat(chatRoom.chatId)"
            class="p-3 sm:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
            :class="{
              'bg-blue-50 border-blue-200': adminChatState.activeChatId === chatRoom.chatId
            }"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="font-medium text-sm sm:text-base truncate">{{ chatRoom.fullName }}</h3>
                  <div 
                    class="w-2 h-2 rounded-full flex-shrink-0"
                    :class="{
                      'bg-green-500': chatRoom.status === 'online',
                      'bg-yellow-500': chatRoom.status === 'away',
                      'bg-gray-400': chatRoom.status === 'offline'
                    }"
                  ></div>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 truncate">{{ chatRoom.email }}</p>
                <p class="text-xs sm:text-sm text-gray-800 truncate mt-1">
                  <span v-if="chatRoom.isTyping" class="text-blue-600 italic">typing...</span>
                  <span v-else>{{ chatRoom.lastMessage }}</span>
                </p>
              </div>
              <div class="text-right flex-shrink-0 ml-2">
                <div class="text-xs text-gray-500">
                  {{ formatTime(chatRoom.timestamp) }}
                </div>
                <div
                  v-if="chatRoom.unreadCount > 0"
                  class="bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center mt-1 ml-auto"
                >
                  {{ chatRoom.unreadCount > 99 ? '99+' : chatRoom.unreadCount }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Chat Area -->
      <div class="flex-1 flex flex-col lg:ml-0" :class="{ 'ml-0': !isMobileDrawerOpen }">
        <!-- Mobile Header with Hamburger -->
        <div v-if="!adminChatState.activeChatId" class="lg:hidden p-4 bg-white border-b border-gray-200">
          <div class="flex items-center justify-between">
            <button
              @click="openMobileDrawer"
              class="p-2 rounded-md hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
              </svg>
            </button>
            <h1 class="text-lg font-semibold">Chat Support</h1>
            <button
              @click="closeChatUI"
              class="p-2 rounded-md hover:bg-gray-100 text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
              </svg>
            </button>
          </div>
        </div>
  
        <div v-if="!adminChatState.activeChatId" class="flex-1 flex items-center justify-center p-4">
          <div class="text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" class="sm:w-16 sm:h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 256 256">
              <path d="M168,112a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,112Zm-8,24H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm72-8A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z"></path>
            </svg>
            <p class="text-sm sm:text-base">Select a chat to start messaging</p>
            <button
              @click="openMobileDrawer"
              class="mt-4 lg:hidden px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              View Conversations
            </button>
          </div>
        </div>
        
        <div v-else class="flex-1 flex flex-col">
          <!-- Active Chat Header -->
          <div class="p-3 sm:p-4 border-b border-gray-200 bg-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <!-- Back/Hamburger button for mobile -->
                <button
                  @click="openMobileDrawer"
                  class="lg:hidden p-1 rounded-md hover:bg-gray-100 flex-shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
                  </svg>
                </button>
                <div class="min-w-0 flex-1">
                  <h3 class="font-medium text-sm sm:text-base truncate">{{ activeChat?.fullName }}</h3>
                  <p class="text-xs sm:text-sm text-gray-600 truncate">{{ activeChat?.email }}</p>
                </div>
              </div>
              <div class="flex gap-2 flex-shrink-0">
                <button
                  @click="closeActiveChat"
                  class="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Close
                </button>
                <button
                  @click="closeChatUI"
                  class="p-1 sm:p-2 rounded-md hover:bg-gray-100 text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Messages -->
          <div 
            ref="adminMessagesContainer"
            class="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-50"
          >
            <div class="space-y-3 sm:space-y-4">
              <div
                v-for="message in adminChatState.activeMessages"
                :key="message._id || message.timestamp.getTime()"
                class="flex"
                :class="message.sender === 'ADMIN' ? 'justify-end' : 'justify-start'"
              >
                <div 
                  class="max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3"
                  :class="{
                    'bg-blue-600 text-white rounded-tr-none': message.sender === 'admin',
                    'bg-white text-gray-800 rounded-tl-none shadow-sm': message.sender === 'user',
                    'bg-yellow-100 text-yellow-800 rounded-md text-center': message.sender === 'system'
                  }"
                >
                  <p class="text-sm sm:text-base break-words">{{ message.message }}</p>
                  <p class="text-xs mt-1 opacity-70 text-right">
                    {{ formatTime(message.timestamp) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Admin Message Input -->
          <div class="p-3 sm:p-4 border-t border-gray-200 bg-white">
            <form @submit.prevent="handleSendAdminMessage" class="flex gap-2">
              <input
                v-model="adminMessage"
                type="text"
                placeholder="Type your response..."
                class="flex-1 px-3 py-3 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :disabled="!adminChatState.isConnected"
              />
              <button
                type="submit"
                :disabled="!adminMessage.trim() || !adminChatState.isConnected"
                class="px-4 py-2 sm:px-6 sm:py-3 text-sm text-sm sm:text-base bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 flex-shrink-0"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
  import { useAdminChat } from '@/composables/core/useAdminChat'
  
  const adminMessage = ref('')
  const showNotifications = ref(false)
  const adminMessagesContainer = ref<HTMLElement | null>(null)
  const isMobileDrawerOpen = ref(false)
  
  const { 
    state: adminChatState, 
    joinChat, 
    sendMessage, 
    markChatAsRead, 
    closeChat,
    getChatHistory,
    clearNotifications 
  } = useAdminChat()
  
  const activeChat = computed(() => {
    return adminChatState.value.chatRooms.find(
      room => room.chatId === adminChatState.value.activeChatId
    )
  })
  
  const openMobileDrawer = () => {
    isMobileDrawerOpen.value = true
  }
  
  const closeMobileDrawer = () => {
    isMobileDrawerOpen.value = false
  }
  
  const closeChatUI = () => {
    // Emit event or call parent method to close the entire chat UI
    // This depends on how you want to handle closing the chat UI
    console.log('Close Chat UI requested')
    // You might want to emit an event here: emit('close-chat-ui')
  }
  
  const selectChat = async (chatId: string) => {
    try {
      await joinChat(chatId)
      await getChatHistory(chatId)
      markChatAsRead(chatId)
      // Close mobile drawer after selection
      closeMobileDrawer()
    } catch (error) {
      console.error('Failed to select chat:', error)
    }
  }
  
  const handleSendAdminMessage = async () => {
    if (!adminMessage.value.trim() || !adminChatState.value.activeChatId) return
    
    const message = adminMessage.value.trim()
    adminMessage.value = ''
    
    try {
      await sendMessage(adminChatState.value.activeChatId, message)
    } catch (error) {
      console.error('Failed to send admin message:', error)
    }
  }
  
  const closeActiveChat = async () => {
    if (!adminChatState.value.activeChatId) return
    
    try {
      await closeChat(adminChatState.value.activeChatId)
    } catch (error) {
      console.error('Failed to close chat:', error)
    }
  }
  
  // Handle window resize
  const handleResize = () => {
    if (window.innerWidth >= 1024) { // lg breakpoint
      isMobileDrawerOpen.value = false
    }
  }
  
  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
  
  // Scroll to bottom when messages change
  watch(() => adminChatState.value.activeMessages, () => {
    nextTick(() => {
      if (adminMessagesContainer.value) {
        adminMessagesContainer.value.scrollTop = adminMessagesContainer.value.scrollHeight
      }
    })
  }, { deep: true })
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  </script>