import { Send } from 'lucide-react';

export default function TextField() {
    return (
        <div className='relative w-80'>
            <input
                type="text"
                className="w-full px-4 py-2 pr-12 outline-none bg-textfield rounded-lg hover:shadow-lg"
                placeholder='Escribe una idea..'
                />
            <button className='absolute inset-y-0 right-0 flex items-center pr-4 '>
                <Send />
            </button>
        </div>
    )
}