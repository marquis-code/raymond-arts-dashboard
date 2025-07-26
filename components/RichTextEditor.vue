<template>
    <div class="rich-text-editor">
      <div class="editor-toolbar">
        <button
          v-for="tool in tools"
          :key="tool.command"
          type="button"
          class="toolbar-button"
          :class="{ active: isActive(tool.command) }"
          @click="execCommand(tool.command, tool.value)"
        >
          <Icon :name="tool.icon" class="h-4 w-4" />
        </button>
      </div>
      
      <div
        ref="editorRef"
        class="editor-content"
        contenteditable="true"
        :data-placeholder="placeholder"
        @input="handleInput"
        @blur="handleBlur"
        v-html="value"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, nextTick } from 'vue'
  
  interface Props {
    value: string
    placeholder?: string
  }
  
  interface Emits {
    (e: 'update:value', value: string): void
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()
  
  const editorRef = ref<HTMLElement>()
  
  const tools = [
    { command: 'bold', icon: 'heroicons:bold', value: null },
    { command: 'italic', icon: 'heroicons:italic', value: null },
    { command: 'underline', icon: 'heroicons:underline', value: null },
    { command: 'insertUnorderedList', icon: 'heroicons:list-bullet', value: null },
    { command: 'insertOrderedList', icon: 'heroicons:numbered-list', value: null },
    { command: 'createLink', icon: 'heroicons:link', value: null },
  ]
  
  const execCommand = (command: string, value: any = null) => {
    if (command === 'createLink') {
      const url = prompt('Enter URL:')
      if (url) {
        document.execCommand(command, false, url)
      }
    } else {
      document.execCommand(command, false, value)
    }
    editorRef.value?.focus()
  }
  
  const isActive = (command: string) => {
    return document.queryCommandState(command)
  }
  
  const handleInput = () => {
    const content = editorRef.value?.innerHTML || ''
    emit('update:value', content)
  }
  
  const handleBlur = () => {
    const content = editorRef.value?.innerHTML || ''
    emit('update:value', content)
  }
  
  onMounted(() => {
    if (editorRef.value && props.value) {
      editorRef.value.innerHTML = props.value
    }
  })
  </script>
  
  <style scoped>
  .rich-text-editor {
    @apply border border-gray-300 rounded-lg overflow-hidden focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-opacity-20;
  }
  
  .editor-toolbar {
    @apply flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200;
  }
  
  .toolbar-button {
    @apply p-2 rounded hover:bg-gray-200 transition-colors duration-200;
  }
  
  .toolbar-button.active {
    @apply bg-green-100 text-green-600;
  }
  
  .editor-content {
    @apply p-3 min-h-[120px] focus:outline-none;
  }
  
  .editor-content:empty:before {
    content: attr(data-placeholder);
    @apply text-gray-400 italic;
  }
  
  .editor-content ul, .editor-content ol {
    @apply ml-6 my-2;
  }
  
  .editor-content ul {
    @apply list-disc;
  }
  
  .editor-content ol {
    @apply list-decimal;
  }
  
  .editor-content a {
    @apply text-green-600 underline;
  }
  
  .editor-content strong {
    @apply font-bold;
  }
  
  .editor-content em {
    @apply italic;
  }
  
  .editor-content u {
    @apply underline;
  }
  </style>
  