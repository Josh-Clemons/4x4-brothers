import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.tsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import PopularEvents from "./components/PopularEvents.tsx";
import StickyNav from "./StickyNav.tsx";
import Merch from "./components/Merch.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <StickyNav> <App /></StickyNav>
    },
    {
        path:'/events',
        element: <StickyNav> <PopularEvents /></StickyNav>
    },
    {
        path:'/merch',
        element: <StickyNav> <Merch/> </StickyNav>
    }
])



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
