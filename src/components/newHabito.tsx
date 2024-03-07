import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner' //pop-up de sucesso criacao Habito 

interface NewHabitoProps {
    onHabitoCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewHabitoCard({ onHabitoCreated }: NewHabitoProps) {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
    const [isRecording, setIsRecording] = useState(false)
    const [content, setContent] = useState('')

    function handleStartEditor() {
        setShouldShowOnboarding(false)
    }

    function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value)
        if (event.target.value === ''){
            setShouldShowOnboarding(true)
        }
    }

    function handleSaveNote(event: FormEvent) {
        event.preventDefault()

        if(content === ''){
            return
        }

        onHabitoCreated(content)

        setContent('')
        setShouldShowOnboarding(true)

        toast.success('Nota criada com sucesso!')
    }

    function handleStartRecording() {
        const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
        if (!isSpeechRecognitionAPIAvailable) {
            alert('Este navegador não suporta gravações de voz.')
            return
        }

        setIsRecording(true)
        setShouldShowOnboarding(false)

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
        speechRecognition = new SpeechRecognitionAPI()

        speechRecognition.lang = 'pt-BR'

        speechRecognition.continuous = true
        speechRecognition.maxAlternatives = 1
        speechRecognition.interimResults = true

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)
            }, '')

            setContent(transcription)
        }

        speechRecognition.onerror = (event) => {
            console.error(event)
        }

        speechRecognition.start()
    }

    function handleStopRecording() {
        setIsRecording(false)

        if(speechRecognition !== null){
            speechRecognition.stop()
        }
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger className='rounded-md bg-emerald-700 text-left p-5 gap-3 outline-none flex flex-col hover:ring-2 hover:ring-emerald-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
                <span className='text-sm font-medium text-emerald-200'>
                    Adicionar nota
                </span>
                <p className='text-sm leading-6 text-emerald-400'>
                    Grave uma nota em áudio que será convertida para texto automaticamente.
                </p>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className='inset-0 fixed bg-black/50'>
                    <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-emerald-700 md:rounded-md flex flex-col outline-none'>
                        <Dialog.Close className='absolute right-0 top-0 bg-emerald-800 p-1.5 text-emerald-400 rounded-bl-md'>
                            <X className='size-5 hover:text-emerald-100'/>
                        </Dialog.Close>
                        <form className='flex-1 flex flex-col'>
                            <div className='flex flex-1 flex-col gap-3 p-5'>
                                <span className='text-sm font-medium text-emerald-300'>
                                    Adicionar uma nota
                                </span>

                                {shouldShowOnboarding ? (
                                    <p className='text-sm leading-6 text-emerald-400'>
                                        Comece <button type='button' onClick={handleStartRecording} className='font-medium text-lime-400 hover:text-lime-500 hover:underline'>gravando uma nota</button> em áudio ou se preferir <button type='button' onClick={handleStartEditor} className='font-medium text-lime-400 hover:text-lime-500 hover:underline'>utilize apenas texto</button>
                                    </p>

                                ) : (
                                    <textarea
                                        autoFocus
                                        className='text-sm leading-6 text-emerald-400 bg-transparent resize-none flex-1 outline-none'
                                        onChange={handleContentChanged}
                                        value={content}
                                    />
                                )}
                            </div>
                            
                            {isRecording ? (
                                <button type='button' onClick={handleStopRecording} className='w-full flex items-center justify-center gap-2 bg-emerald-900 py-4 text-center text-sm text-emerald-400 outline-none font-medium group hover:text-emerald-100'>
                                    <div className='size-3 rounded-full bg-red-500 animate-pulse'></div>
                                    Gravando! (clique p/ interromper)
                                </button>

                            ) : (
                                <button type='button' onClick={handleSaveNote} className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium group hover:bg-lime-500'>
                                    Salvar nota
                                </button>
                            )}

                        </form>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>            
    )
}