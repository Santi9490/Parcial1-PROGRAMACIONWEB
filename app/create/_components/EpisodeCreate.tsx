'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';

const schema = z.object({
  name: z.string().min(6, "El título debe tener mínimo 6 caracteres"),
  characters: z.string().regex(/^\d+-\d+-\d+-\d+-\d+$/, "Debe seguir el formato: 12-14-1-23-8 (5 IDs separados por guiones)")
});

type FormFields = z.infer<typeof schema>;

export const EpisodeForm = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isValid } } = useForm<FormFields>({
    defaultValues: {
      name: "",
      characters: ""
    },
    resolver: zodResolver(schema),
    mode: "onChange"
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      // Convertir los IDs de personajes separados por guiones a URLs
      const characterIds = data.characters.split('-');
      const characterUrls = characterIds.map(id => `https://rickandmortyapi.com/api/character/${id}`);
      
      // Crear el nuevo episodio
      const nuevoEpisodio = {
        id: Date.now(), 
        name: data.name,
        air_date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        episode: `S00E${Math.floor(Math.random() * 99) + 1}`,
        characters: characterUrls,
        url: `https://rickandmortyapi.com/api/episode/${Date.now()}`,
        created: new Date().toISOString()
      };
      
      // Enviar al API route
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoEpisodio)
      });

      const result = await response.json();

      if (result.success) {
        // Mostrar toast de éxito
        const toast = document.createElement('div');
        toast.textContent = `Episodio "${nuevoEpisodio.name}" creado correctamente`;
        toast.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 12px 20px;
          border-radius: 4px;
          z-index: 1000;
          font-size: 14px;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 3000);

        // Resetear el formulario
        reset();
      } else {
        console.error('Error al crear episodio:', result.message);
      }
      
    } catch (error) {
      console.error('Error al crear episodio:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 >Crear Nuevo Episodio</h1>
      
      <form  onSubmit={handleSubmit(onSubmit)}>
       
        <div>
          <label >
            Título del Episodio
          </label>
          <input 
            {...register('name')}
            type="text"
            placeholder="Ingrese el título (mín. 6 caracteres)"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            IDs de Personajes
          </label>
          <input 
            {...register('characters')}
            type="text"
            placeholder="Ejemplo: 12-14-1-23-8"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.characters && (
            <span className="text-red-500 text-sm">{errors.characters.message}</span>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Ingrese 5 IDs de personajes separados por guiones (-)
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
          <p><strong>Fecha:</strong></p>
          <p><strong>Episodio:</strong></p>
        </div>
        <button 
          disabled={isSubmitting || !isValid}
          type="submit"
        > 
          {isSubmitting ? 'Creando...' : 'Crear Episodio'}
        </button>

        {!isValid && (
          <p >
            Complete todos los campos correctamente para habilitar el botón
          </p>
        )}
      </form>
    </div>
  );
};