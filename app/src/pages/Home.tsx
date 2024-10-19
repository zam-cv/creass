import { Settings, LayoutGrid } from 'lucide-react';

export default function Home() {
    return (
        <div>
            <header>
                <div className='flex justify-between'>
                    <div className='order-first pl-5 pt-3 '>
                        <LayoutGrid size={35} />
                    </div>
                    <div className='order-last pr-5 pt-3'>
                        <Settings size={35}/>
                    </div>
                </div>
            </header>
            <body>

            </body>
        </div>
    )
}