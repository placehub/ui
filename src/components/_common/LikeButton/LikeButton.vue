<template>
  <button
    type="button"
    class="px-2.5 h-[28px] text-sm flex items-center rounded-lg overflow-hidden"
    :class="{[like.isLiked ? 'bg-red-100' : 'bg-slate-100']: true}"
    :title="like.isLiked ? 'Вам понравилось' : 'Мне нравится'"
    @click="onClick">
    <Heart class="h-4 w-4 mr-1" :class="{[like.isLiked ? 'text-red-500' : 'text-gray-500']: true}" />
    <span class="min-w-[12px] text-slate-600 text-xs font-semibold text-right">{{ like.count }}</span>
  </button>
</template>

<script setup>
import { useQuery } from '../../../index'
import { Heart } from 'lucide-vue-next'
import { ref } from 'vue'

const emits = defineEmits(['status'])

const props = defineProps({
  modelType: {
    type: String,
    required: true,
  },
  modelId: {
    type: [Number, String],
    required: true,
  },

  isLiked: {
    type: Boolean,
    default: false,
  },

  count: {
    type: Number,
    default: 0,
  },
})

const like = ref({
  isLiked: props.isLiked,
  count: props.count,
})

const isLoading = ref(false)

const onClick = async () => {
  if (isLoading.value) {
    return
  }

  isLoading.value = true

  try {
    const { data: { likeDislike }} = await useQuery({
      query: `
        mutation($modelType: String!, $modelId: ID!) {
          likeDislike(modelType: $modelType, modelId: $modelId)
        }
      `,
      variables: {
        modelType: props.modelType,
        modelId:   props.modelId,
      }
    })

    like.value.isLiked = (likeDislike === 'like');

    if (like.value.isLiked) {
      like.value.count++;
    } else if (like.value.count > 0) {
      like.value.count--;
    }

    emits('status', likeDislike)
  } catch (errors) {
    console.log(errors)
  }
  finally {
    isLoading.value = false
  }
}
</script>
