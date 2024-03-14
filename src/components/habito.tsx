import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { X } from 'lucide-react'

interface HabitoProps {
    habito: {
        id: string
        date: Date
        content: string
    }
    HabitoDeleted: (id: string) => void
}

export function Habito({ habito, HabitoDeleted }: HabitoProps) {
    
    return (
        <Dialog.Root>
            <Dialog.Trigger className='rounded-md bg-violet-800 text-left p-5 gap-3 outline-none flex flex-col hover:ring-2 hover:ring-violet-300 focus-visible:ring-2 focus-visible:ring-violet-300'>
                <span className='text-sm font-bold text-yellow-500'>
                    {formatDistanceToNow(habito.date, { locale: ptBR, addSuffix: true })}
                </span>
                <p className='text-sm leading-6 text-violet-200'>
                    {habito.content}
                </p>

                <div className='absolute bottom-0 left-0 right-0 h-1/2 from-black/60 to-black/0 pointer-events-none' />
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className='inset-0 fixed bg-black/50'>
                    <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-violet-900 md:rounded-md flex flex-col outline-none'>
                        <Dialog.Close className='absolute right-0 top-0 bg-violet-950 p-1.5 text-violet-300 rounded-bl-md'>
                            <X className='size-5 hover:text-violet-100'/>
                        </Dialog.Close>
                        <div className='flex flex-1 flex-col gap-3 p-5'>
                            <span className='text-sm font-medium text-yellow-500'>
                                {formatDistanceToNow(habito.date, { locale: ptBR, addSuffix: true })}
                            </span>
                            <p className='text-sm leading-6 text-violet-200'>
                                {habito.content}
                            </p>
                        </div>

                        <button type='button' onClick={() => HabitoDeleted(habito.id)} className='w-full bg-violet-300 py-4 text-center text-sm text-violet-950 outline-none font-medium group hover:bg-violet-400'>
                           Deseja <span className='text-red-700 group-hover:underline'>excluir</span> esse hábito?
                        </button>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    )
}