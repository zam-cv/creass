import { Send } from 'lucide-react';
import { useRef } from 'react';

export default function TextField() {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    return (
        <div className='relative w-80'>
            <textarea
                ref={textareaRef}
                className="w-full px-4 py-2 pr-12 outline-none bg-textfield rounded-lg hover:shadow-lg res"
                placeholder='Escribe una idea..'
                onInput={handleInput}
                rows={1}
                style={{resize : 'none', maxHeight: '4.5em', overflowY:'hidden'}}
            />
            <button className='absolute inset-y-0 right-0 flex items-center pr-4 '>
                <Send />
            </button>
        </div>
    );
}