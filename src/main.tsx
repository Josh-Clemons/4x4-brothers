import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Home    from './pages/Home'
import Events  from './pages/Events'
import About   from './pages/About'
import Merch   from './pages/Merch'
import Gallery from './pages/Gallery'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true,        element: <Home />    },
      { path: 'events',     element: <Events />  },
      { path: 'about',      element: <About />   },
      { path: 'merch',      element: <Merch />   },
      { path: 'gallery',    element: <Gallery /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
