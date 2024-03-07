import { ChangeEvent, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import { NewHabitoCard } from './components/newHabito'

interface Habito {
  id: string
  date: Date
  content: string
}

export function App() {

  const [search, setSearch] = useState('')
  const [habitos, setHabitos] = useState<Habito[]>(() => {
    const habitosOnStorage = localStorage.getItem('habitos')

    if(habitosOnStorage) {
      return JSON.parse(habitosOnStorage)
    }
    return []
  })

  function onHabitoCreated(content: string) {
    const newHabito = {
      id: crypto.randomUUID(),
      date: new Date(),
      content
    }

    const habitosArray = [newHabito, ...habitos]

    localStorage.setItem('habitos', JSON.stringify(habitosArray))
    setHabitos(habitosArray)
  }

  function onHabitoDeleted (id: string) {
    const habitosArray = habitos.filter(habito => {
      return habito.id !== id
    })
    setHabitos(habitosArray)

    localStorage.setItem('habitos', JSON.stringify(habitosArray))

  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>){
    const query = event.target.value

    setSearch(query)
  }

  const filteredHabitos = search !== ''
    ? habitos.filter(habito => habito.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    : habitos

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5'>
      <h1 className='text-violet-900 text-4xl '>Registro de Hábitos</h1>
      <form className='w-full'>
        <input 
          type="text" 
          placeholder='Buscar hábito...' 
          className='w-full bg-transparent text-2xl font-semibold tracking-tight outline-none placeholder:text-violet-700'
          onChange={handleSearch}
        />
      </form>
      <div className='h-px bg-violet-950'/>

      <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]'>
        <NewHabitoCard onHabitoCreated={onHabitoCreated} />
        
        {/* {filteredHabitos.map(habito => {
          return <NoteCard key={habito.id} habito={habito} onHabitoDeleted={onHabitoDeleted} />
        })} */}
      </div>
    </div>
  )
}


