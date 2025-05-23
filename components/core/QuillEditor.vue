<template>
    <main>
      <QuillEditor 
        v-model:content="innerContent"  
        contentType="html"
        theme="snow"
        toolbar="full" 
        :options="quillOptions"
        @update:content="handleContentUpdate"
      />
    </main>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, watch } from "vue";
  import { QuillEditor } from "@vueup/vue-quill";
  import "@vueup/vue-quill/dist/vue-quill.snow.css";
  
  export default defineComponent({
    name: "CoreQuill",
    components: {
      QuillEditor
    },
    props: {
      modelValue: {
        type: String as any,
        default: '',
      },
      placeholder: {
        type: String as any,
        default: 'Start writing your content...',
      },
    },
    emits: ["update:modelValue"],
    setup(props, { emit }) {
      const innerContent = ref<string>(props.modelValue);
  
      // Quill editor options
      const quillOptions = {
        placeholder: props.placeholder,
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            ['clean']
          ]
        },
        formats: [
          'header', 'font', 'size',
          'bold', 'italic', 'underline', 'strike', 'blockquote',
          'list', 'bullet', 'indent',
          'link', 'image', 'color', 'background',
          'align', 'code-block'
        ]
      };
  
      // Handle content updates from Quill
      const handleContentUpdate = (content: string) => {
        // Ensure we're always working with HTML content
        innerContent.value = content || '';
        emit("update:modelValue", content || '');
      };
  
      // Watch for changes in the parent value
      watch(
        () => props.modelValue,
        (newValue) => {
          if (newValue !== innerContent.value) {
            innerContent.value = newValue || '';
          }
        }
      );
  
      // Emit changes back to the parent
      watch(innerContent, (newValue) => {
        emit("update:modelValue", newValue || '');
      });
  
      return {
        innerContent,
        quillOptions,
        handleContentUpdate,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Custom Quill styles */
  :deep(.ql-toolbar) {
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
  
  :deep(.ql-container) {
    border: none;
    font-family: inherit;
  }
  
  :deep(.ql-editor) {
    min-height: 150px;
    font-size: 14px;
    line-height: 1.6;
  }
  
  :deep(.ql-editor.ql-blank::before) {
    font-style: italic;
    color: #9ca3af;
  }
  
  :deep(.ql-snow .ql-tooltip) {
    z-index: 1000;
  }
  
  /* Ensure proper HTML rendering */
  :deep(.ql-editor p) {
    margin-bottom: 1em;
  }
  
  :deep(.ql-editor h1, .ql-editor h2, .ql-editor h3, .ql-editor h4, .ql-editor h5, .ql-editor h6) {
    font-weight: bold;
    margin-bottom: 0.5em;
  }
  
  :deep(.ql-editor ul, .ql-editor ol) {
    margin-bottom: 1em;
    padding-left: 1.5em;
  }
  
  :deep(.ql-editor blockquote) {
    border-left: 4px solid #ccc;
    margin-bottom: 1em;
    padding-left: 1em;
    font-style: italic;
  }
  </style>