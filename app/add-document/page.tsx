"use client"

import { MouseEvent, ChangeEvent, FormEvent, useState } from 'react';
import { addDocument } from '../api/api';
import { useRouter } from 'next/navigation';


const AddDocument = () => {
    const [name, setName] = useState('')
    const [numbers, setNumbers] = useState<string[]>([])
    const [fileList, setFileList] = useState<FileList | null>(null);
    const router = useRouter()

    const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFileList(e.target.files);
        }
    }

    const addNumber = (e: MouseEvent) => {
        e.preventDefault()
        setNumbers([...numbers, ''])
    }

    const handleChangeNumber = (e: ChangeEvent<HTMLInputElement>, i: number) => {
        setNumbers(
            [
                ...numbers.slice(0, i),
                e.target.value,
                ...numbers.slice(i + 1)
            ]
        )
    }

    const files = fileList ? [...fileList] : [];

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        try {
            const res = await addDocument(name, numbers, files)
            console.log(res.data)
        }
        catch (err) {
            alert('Документ с таким именем уже существует')
            return
        }

        alert('Документ ' + name + ' добавлен')
        router.push('/')
    }

    return (
        <div className='h-screen flex justify-center items-center'>

            <div className="">
                <form className="border border-fuchsia-400 rounded p-4" onSubmit={handleSubmit}>
                    <h3 className="mb-5">
                        Добавление нового документа
                    </h3>

                    <div className='space-y-3'>
                        <label className="block">
                            <div>Название документа</div>
                            <input type="text" className="outline-none p-1 rounded bg-slate-600" value={name} onChange={handleChangeName} />
                        </label>

                        <label className="block">
                            <div>Выберите файлы</div>
                            <input type='file' multiple
                                accept='application/pdf, image/png' className="outline-none p-1 rounded bg-slate-600" onChange={handleFileChange} />
                            <ul>
                                {files.map((file, i) => (
                                    <li key={i}>
                                        {file.name} - {file.type}
                                    </li>
                                ))}
                            </ul>
                        </label>

                        {
                            numbers.map(
                                (n, i) => {
                                    return (
                                        <label className="block">
                                            <div>Номер {i}</div>
                                            <input type="text" className="outline-none p-1 rounded bg-slate-600" value={numbers[i]} onChange={async (event) => await handleChangeNumber(event, i)} />
                                        </label>
                                    )
                                })
                        }
                    </div>


                    <div className='flex justify-between space-x-2 flex-wrap'>
                        <button type='submit' className="mt-5 uppercase rounded p-1 bg-fuchsia-600/60">
                            ДОБАВИТЬ Документ
                        </button>

                        <button className="mt-5 uppercase rounded p-1 bg-fuchsia-600/60" onClick={addNumber}>
                            ДОБАВИТЬ номер
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default AddDocument