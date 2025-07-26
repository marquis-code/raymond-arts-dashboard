<!-- <template>
    <component :is="iconComponent" v-bind="$attrs" />
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import {
    InformationCircleIcon,
    ScaleIcon,
    CreditCardIcon,
    PaintBrushIcon,
    PhotoIcon,
    EyeIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PlusIcon,
    TrashIcon,
    CurrencyDollarIcon,
    TagIcon,
    MegaphoneIcon,
    CloudArrowUpIcon,
    FolderOpenIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    XMarkIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    DocumentTextIcon,
    CubeIcon,
    BanknotesIcon,
    // PercentIcon,
  } from '@heroicons/vue/24/outline'
  
  interface Props {
    name: string
  }
  
  const props = defineProps<Props>()
  
  const iconMap = {
    'heroicons:information-circle': InformationCircleIcon,
    'heroicons:scale': ScaleIcon,
    'heroicons:credit-card': CreditCardIcon,
    'heroicons:paint-brush': PaintBrushIcon,
    'heroicons:photo': PhotoIcon,
    'heroicons:eye': EyeIcon,
    'heroicons:chevron-left': ChevronLeftIcon,
    'heroicons:chevron-right': ChevronRightIcon,
    'heroicons:plus': PlusIcon,
    'heroicons:trash': TrashIcon,
    'heroicons:currency-dollar': CurrencyDollarIcon,
    'heroicons:tag': TagIcon,
    'heroicons:megaphone': MegaphoneIcon,
    'heroicons:cloud-arrow-up': CloudArrowUpIcon,
    'heroicons:folder-open': FolderOpenIcon,
    'heroicons:arrow-path': ArrowPathIcon,
    'heroicons:check-circle': CheckCircleIcon,
    'heroicons:x-mark': XMarkIcon,
    'heroicons:x-circle': XCircleIcon,
    'heroicons:exclamation-triangle': ExclamationTriangleIcon,
    'heroicons:document-text': DocumentTextIcon,
    'heroicons:cube': CubeIcon,
    'heroicons:banknotes': BanknotesIcon,
    // 'heroicons:percent': PercentIcon,
  }
  
  const iconComponent = computed(() => {
    return iconMap[props.name as keyof typeof iconMap] || InformationCircleIcon
  })
  </script>
   -->

   <template>
    <component :is="iconComponent" v-bind="$attrs" />
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import {
    InformationCircleIcon,
    ScaleIcon,
    CreditCardIcon,
    PaintBrushIcon,
    PhotoIcon,
    EyeIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PlusIcon,
    TrashIcon,
    CurrencyDollarIcon,
    TagIcon,
    MegaphoneIcon,
    CloudArrowUpIcon,
    FolderOpenIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    XMarkIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    DocumentTextIcon,
    CubeIcon,
    BanknotesIcon,
  } from '@heroicons/vue/24/outline'
  
  interface Props {
    name: string
  }
  
  const props = defineProps<Props>()
  
  const iconMap = {
    'heroicons:information-circle': InformationCircleIcon,
    'heroicons:scale': ScaleIcon,
    'heroicons:credit-card': CreditCardIcon,
    'heroicons:paint-brush': PaintBrushIcon,
    'heroicons:photo': PhotoIcon,
    'heroicons:eye': EyeIcon,
    'heroicons:chevron-left': ChevronLeftIcon,
    'heroicons:chevron-right': ChevronRightIcon,
    'heroicons:plus': PlusIcon,
    'heroicons:trash': TrashIcon,
    'heroicons:currency-dollar': CurrencyDollarIcon,
    'heroicons:tag': TagIcon,
    'heroicons:megaphone': MegaphoneIcon,
    'heroicons:cloud-arrow-up': CloudArrowUpIcon,
    'heroicons:folder-open': FolderOpenIcon,
    'heroicons:arrow-path': ArrowPathIcon,
    'heroicons:check-circle': CheckCircleIcon,
    'heroicons:x-mark': XMarkIcon,
    'heroicons:x-circle': XCircleIcon,
    'heroicons:exclamation-triangle': ExclamationTriangleIcon,
    'heroicons:document-text': DocumentTextIcon,
    'heroicons:cube': CubeIcon,
    'heroicons:banknotes': BanknotesIcon,
    // Fallbacks for missing icons
    'heroicons:percent': InformationCircleIcon, // Use info icon as fallback
    'heroicons:list-bullet': InformationCircleIcon,
    'heroicons:numbered-list': InformationCircleIcon,
    'heroicons:link': InformationCircleIcon,
    'heroicons:bold': InformationCircleIcon,
    'heroicons:italic': InformationCircleIcon,
    'heroicons:underline': InformationCircleIcon,
  }
  
  const iconComponent = computed(() => {
    return iconMap[props.name as keyof typeof iconMap] || InformationCircleIcon
  })
  </script>
  