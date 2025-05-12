import './App.css'
import { useState } from 'react'
import Header from './components/Header'
import Invoice from './components/invoice'
import { ThemeProvider } from './components/ThemeProvider'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ViewInvoice from './components/ViewInvoice'

function App() {
  const [invoiceId, setInvoiceId] = useState(null);
  

  return (
    <ThemeProvider>
      <main className='relative z-30 overflow-x-hidden min-h-screen  bg-white dark:bg-[#141625] lg:flex lg:flex-row'>
        
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path='/' element={<Invoice setInvoiceId={setInvoiceId}/>}/>
          <Route path='/viewInvoice' element={<ViewInvoice invoiceId={invoiceId} setInvoiceId={setInvoiceId}/>}/>
        </Routes>
      </BrowserRouter>
        
        
      </main>
    </ThemeProvider>
    
  )
}

export default App
