import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'demo') {
    return {
      base: '/react-roof/',
      plugins: [react()],
      build: {
        outDir: 'dist-demo',
      }
    }
  }

  return {
    plugins: [
      react(),
      dts({
        rollupTypes: true,
        tsconfigPath: './tsconfig.app.json'
      })
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/roof/index.ts'),
        name: 'ReactRoof',
        fileName: 'react-roof',
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'jsxRuntime'
          },
        },
      },
    }
  }
})
