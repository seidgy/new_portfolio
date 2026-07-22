<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { marked } from 'marked'

const props = defineProps<{
  path: string
}>()

const i18n = useI18n()
const locale = computed(() => i18n.locale.value)

// Dynamic import of markdown files as raw strings
const modules = import.meta.glob('../../locales/**/*.md', { query: '?raw', import: 'default' })

const content = ref('')

watch([locale, () => props.path], async () => {
  const filePath = `../../locales/${locale.value}/${props.path}.md`
  const resolver = modules[filePath]
  if (resolver) {
    try {
      const raw = await resolver() as string
      // Configure marked to render safe HTML or just parse it
      content.value = await marked.parse(raw)
    } catch (e) {
      console.error(e)
      content.value = `<p>Error loading content: ${props.path}</p>`
    }
  } else {
    content.value = `<p>Content not found for ${locale.value}/${props.path}</p>`
  }
}, { immediate: true })
</script>

<template>
  <div class="markdown-content" v-html="content"></div>
</template>

<style lang="scss">
.markdown-content {
  h1 {
    font-family: 'Outfit', sans-serif;
    font-weight: 900;
    color: var(--text-primary);
    margin: 0;
    line-height: 0.9;
  }

  p {
    font-family: 'Inter', sans-serif;
    font-size: 1.125rem; // 18px
    line-height: 1.6;
    color: var(--text-secondary);
    
    strong {
      color: var(--color-primary);
    }
  }
}
</style>
