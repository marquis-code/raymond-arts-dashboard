<template>
    <div class="relative">
      <button
        type="button"
        class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
        @click="toggleDropdown"
        aria-haspopup="listbox"
        :aria-expanded="isOpen"
      >
        <span class="block truncate">{{ selectedOptionLabel || placeholder }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            class="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.25 8.5a.75.75 0 011.1 1.02L10 15.148l2.7-2.908a.75.75 0 011.1 1.02l-3.25 3.5A.75.75 0 0110 17a.75.75 0 01-.55-.24l-3.25-3.5a.75.75 0 01.55-1.26z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </button>
  
      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <ul
          v-if="isOpen"
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          tabindex="-1"
          role="listbox"
          aria-labelledby="listbox-label"
          @mouseleave="isOpen = false"
        >
          <li
            v-for="option in options"
            :key="option.value"
            @click="selectOption(option)"
            class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-blue-600 hover:text-white"
            :class="{ 'bg-blue-600 text-white': modelValue === option.value }"
            role="option"
            :aria-selected="modelValue === option.value"
          >
            <span class="block truncate">{{ option.label }}</span>
            <span
              v-if="modelValue === option.value"
              class="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600"
              :class="{ 'text-white': modelValue === option.value }"
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </li>
          <li v-if="options.length === 0" class="py-2 pl-3 pr-9 text-gray-500">No options</li>
        </ul>
      </Transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  
  interface SelectOption {
    label: string;
    value: string;
  }
  
  const props = defineProps<{
    modelValue: string;
    options: SelectOption[];
    placeholder?: string;
  }>();
  
  const emit = defineEmits(['update:modelValue']);
  
  const isOpen = ref(false);
  
  const selectedOptionLabel = computed(() => {
    const selected = props.options.find((option) => option.value === props.modelValue);
    return selected ? selected.label : '';
  });
  
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };
  
  const selectOption = (option: SelectOption) => {
    emit('update:modelValue', option.value);
    isOpen.value = false;
  };
  </script>