import { ref, readonly } from "vue"

export const useImageUpload = () => {
  const imageFiles = ref<File[]>([])
  const imagePreviews = ref<string[]>([])
  const isUploading = ref(false)
  const uploadProgress = ref(0)

  const handleImageUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    if (fileArray.length === 0) return

    isUploading.value = true
    uploadProgress.value = 0

    try {
      // Create preview URLs
      const newPreviews = fileArray.map((file) => URL.createObjectURL(file))
      imagePreviews.value.push(...newPreviews)
      imageFiles.value.push(...fileArray)

      // Simulate upload progress
      const interval = setInterval(() => {
        uploadProgress.value += 10
        if (uploadProgress.value >= 100) {
          clearInterval(interval)
          isUploading.value = false
        }
      }, 200)

      // Here you would typically upload to your server
      // const uploadedUrls = await uploadToServer(fileArray)
    } catch (error) {
      console.error("Error uploading images:", error)
      isUploading.value = false
    }
  }

  const removeImage = (index: number) => {
    // Revoke object URL to prevent memory leaks
    if (imagePreviews.value[index]) {
      URL.revokeObjectURL(imagePreviews.value[index])
    }

    imagePreviews.value.splice(index, 1)
    imageFiles.value.splice(index, 1)
  }

  const clearImages = () => {
    // Revoke all object URLs
    imagePreviews.value.forEach((url) => URL.revokeObjectURL(url))

    imageFiles.value = []
    imagePreviews.value = []
    isUploading.value = false
    uploadProgress.value = 0
  }

  return {
    imageFiles: readonly(imageFiles),
    imagePreviews: readonly(imagePreviews),
    isUploading: readonly(isUploading),
    uploadProgress: readonly(uploadProgress),
    handleImageUpload,
    removeImage,
    clearImages,
  }
}
