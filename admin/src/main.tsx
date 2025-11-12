import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'
import { RouterProvider } from 'react-router-dom'
import router from './routes/routes.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App as AntdApp } from 'antd';
import './index.css'
import "antd/dist/reset.css"


const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}>
          <AntdApp>
            <RouterProvider router={router} />

          </AntdApp>
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>,
)
