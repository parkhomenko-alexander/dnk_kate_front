"use client"
import { deleteDoc, Document, getDocuments } from '@/app/api/api'
import Link from 'next/link'
import { useQuery } from 'react-query'
import Image from 'next/image';
import { MouseEvent, useState } from 'react';




const Home = () => {

  const [data, setData] = useState<Document[]>([])

  const { isLoading, data: response } = useQuery("document list", async () => {
    const res = await getDocuments()
    setData(res.data)
  })


  const handleCopy = async (e: MouseEvent<HTMLInputElement>) => {
    const inp = e.currentTarget as HTMLInputElement
    inp.classList.add("bg-pink-400/70");
    setTimeout(() => {
      inp.classList.remove("bg-pink-400/70");
    }, 300)
    navigator.clipboard.writeText(inp.value);
  }

  const handleRemove = async (id: string, name: string) => {
    console.log(id)

    const res = await deleteDoc(id)

    if (res.status === 200) {
      console.log(res)

      alert('Документ "' + name + '" удалён')

      setData(
        data =>
          data.filter(
            doc => doc.id.toString() !== id
          )
      )
    }
    return
  }

  return (
    <main className="flex min-h-screen bg-gray-900 flex-col items-center pt-20 px-10 pb-44">
      <h2 className="uppercase font-semibold text-3xl">
        мои документы
      </h2>

      {isLoading ?

        <div className="mt-10">Loading...</div> :

        <section className="mt-10  grid justify-stretch grid-cols-1  sm:grid-cols-2 gap-5">
          {
            data.length === 0 ? <div className="mt-10">Список документов пуст</div> :
              data.map(
                doc => {
                  return (
                    <div key={doc.id} className="p-5 w-60 bg-black/20 flex flex-col justify-between border border-fuchsia-500 text-slate-300 rounded">
                      <div className="flex justify-between items-center">
                        <h5 className="uppercase whitespace-pre-wrap">
                          {doc.name}
                        </h5>
                        <button type="button" className="p-1 border border-fuchsia-500 rounded hover:bg-fuchsia-500/80 text-white transition-colors duration-300 ease-linear stroke-fuchsia-500 hover:stroke-slate-100"
                          onClick={() => handleRemove(doc.id.toString(), doc.name)}
                        >
                          <svg viewBox="0 0 24 24" className="w-5 h-5 " fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.99997 8H6.5M6.5 8V18C6.5 19.1046 7.39543 20 8.5 20H15.5C16.6046 20 17.5 19.1046 17.5 18V8M6.5 8H17.5M17.5 8H19M9 5H15M9.99997 11.5V16.5M14 11.5V16.5" fill=".5M17" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </button>
                      </div>

                      <div className='flex justify-between space-x-2 overflow-x-scroll no-scrollbar my-3'>
                        {
                          doc.files.map(
                            i => {
                              return (
                                <Link key={Date.now() + i} className="flex-none" href={`http://localhost:5000/documents/download/${i}`}>
                                  {
                                    i.split('.')[1] !== 'pdf' ?
                                      <Image
                                        className=''
                                        loader={src => `http://localhost:5000/static/upload/${i}`}
                                        src={i} alt={i} width="64" height="64" />
                                      :
                                      <Image src="/pdf.png" alt={i} width="64" height="64" />
                                  }
                                </Link>
                              )
                            }
                          )
                        }
                      </div>

                      <div className="space-y-3">
                        {
                          doc.numbers.map(
                            number => {
                              return (
                                <input type="text" key={Date.now() + number} defaultValue={number.toString()} className="block w-full cursor-pointer p-2 bg-pink-300/70 rounded outline-none" readOnly
                                  onClick={(e) => handleCopy(e)} />
                              )
                            }
                          )
                        }
                      </div>
                    </div>
                  )
                }
              )
          }
          
        </section>
      }
      <Link href="/add-document">
            <button className='fixed top-[90%] left-3/4 rounded-2xl p-2 bg-fuchsia-400'>
              Добавить документ
            </button>
          </Link>
    </main>
  )
}

export default Home 