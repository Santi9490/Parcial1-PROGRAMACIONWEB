'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import z, { set } from 'zod'
import { Character } from '../../model/episodes';

  const schema = z.object({
  name: z.string(),
  image: z.string(),
})

type FormFields = z.infer<typeof schema>


export const CharacterForm = () => {

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
        const response = await fetch('/api/', {method: 'POST', body: JSON.stringify(data) })
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
      <h1>Character Form</h1>
      <form className="w-2/3 p-5 flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)} >
      <label> Name </label>
      <input 
          {...register('name', {required: "Campo requerido"})}
          type="text"
          placeholder="Name"
          className="border border-white p-2"
      />
      {errors.name && <span className="text-red-500">{errors.name.message}</span>}
      <label> Image </label>
      <input 
          {...register('image', {required: "Campo requerido"})}
          type="text"
          placeholder="image"
          className="border border-white p-2"
      />
      {errors.image && <span className='text-red-500'>{errors.image.message}</span>}          

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