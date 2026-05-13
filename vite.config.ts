import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(({ mode }) => {
  const isCraftNova = mode === 'craftnova'

  return {
    plugins: [react(), ...(isCraftNova ? [viteSingleFile()] : [])],
    base: isCraftNova ? './' : '/',
    publicDir: isCraftNova ? false : 'public',
    resolve: {
      alias: {
        '@ads/AdSlot': isCraftNova
          ? '/src/ads/CraftNovaAdSlot.tsx'
          : '/src/ads/VercelAdSlot.tsx',
      },
    },
    define: {
      __CRAFTNOVA_BUILD__: JSON.stringify(isCraftNova),
    },
  }
})
