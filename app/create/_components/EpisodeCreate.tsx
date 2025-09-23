'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import z, { set } from 'zod'
import { Episode } from '../../model/episodes';
import { CharacterForm } from './CharacterForm';

  const schema = z.object({
  name: z.string(),
  air_date: z.string(),
  episode: z.email(),
  url: z.string(),
  created: z.string()
})

type FormFields = z.infer<typeof schema>


export const EpisodeForm = () => {

  const {register, handleSubmit,setError, formState: {errors, isSubmitting}} = useForm<FormFields>(
    {defaultValues: {
      
    },
    resolver: zodResolver(schema)
  }

  )

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log(data);
        const response = await fetch('/api', {method: 'POST', body: JSON.stringify(data) })
        if(!response.ok) throw new Error();
        else{
          const author = await response.json()
          console.log(author);
        }
      } catch (error) {
        
        setError("name", {message: 'Error en el nombre'})
      }
  }


  return (
    <div>
      <h1>Episode Form</h1>
      <form className="w-2/3 p-5 flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)} >
      <label> Name </label>
      <input 
          {...register('name', {required: "Campo requerido"})}
          type="text"
          placeholder="Name"
          className="border border-white p-2"
      />
      {errors.name && <span className="text-red-500">{errors.name.message}</span>}
      <label> Date </label>
      <input 
          {...register('air_date', {required: "Campo requerido"})}
          type="text"
          placeholder="air_date"
          className="border border-white p-2"
      />
      {errors.air_date && <span className='text-red-500'>{errors.air_date.message}</span>}
      <label> Episode </label>
      <input 
          {...register('episode', {required: "Campo requerido"})}
          type="text"
          placeholder="Email"
          className="border border-white p-2"
          />
        {errors.episode && <span className='text-red-500'>{errors.episode.message}</span>}
      <label> characters </label>
      <CharacterForm/>
      <label>
        url
      </label>
      <input 
          {...register('url', {required: "Campo requerido"})}
          type="string"
          placeholder="url"
          className="border border-white p-2"
      />
      {errors.url && <span className='text-red-500'>{errors.url.message}</span>}
      <label>
        Created
      </label>
      <input 
          {...register('created', {required: "Campo requerido"})}
          type="string"
          className="border border-white p-2"
      />
      {errors.created && <span className='text-red-500'>{errors.created.message}</span>}
          

          <button disabled={isSubmitting} type="submit"> 
          {
            isSubmitting ? 'Cargando': 'Crear'
          }  
          </button>

          {errors.root && <span className='text-red-500'>{errors.root.message}</span>}          

    </form>


    </div>
  )
}