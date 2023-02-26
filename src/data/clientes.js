export async function obtenerClientes () {
  console.log(import.meta.env.VITE_API_URL)
  const respuesta = await fetch(import.meta.env.VITE_API_URL)
  const resultado = await respuesta.json()
  return resultado
}