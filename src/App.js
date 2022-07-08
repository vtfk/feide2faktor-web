import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Main from './routes'
import { QueryClientProvider, QueryClient} from "react-query"

const queryClient = new QueryClient()

function App() {
  return (
    <div className='App'>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path='/*' element={ <Main />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;

