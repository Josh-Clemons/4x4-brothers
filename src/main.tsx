import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Home    from './pages/Home'
import Events  from './pages/Events'
import About   from './pages/About'
import Merch   from './pages/Merch'
import Gallery from './pages/Gallery'
import Album   from './pages/Album'
import Rigs    from './pages/Rigs'
import { flags } from './config/flags'
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
      ...(flags.galleryEnabled ? [{ path: 'gallery/:albumId', element: <Album /> }] : []),
      ...(flags.rigsEnabled    ? [{ path: 'rigs',             element: <Rigs />  }] : []),
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
