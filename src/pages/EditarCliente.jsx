import {
    Form,
    useNavigate,
    useLoaderData,
    useActionData,
    redirect,
} from "react-router-dom";
import { actualizarCliente, obtenerCliente } from "../data/clientes";
import Formulario from "../components/Formulario";
import Error from "../components/Error";

//useLoaderDate es un hook que se usa para obtener lo que esta retornando el loader
export async function loader({ params }) {
    //console.log(params)
    const cliente = await obtenerCliente(params.clienteId);
    if (Object.values(cliente).length === 0) {
        throw new Response("", {
            status: 404,
            statusText: "No hay resultados",
        });
    }
    //console.log(cliente);
    return cliente;
}

export async function action({ request, params }) {
    const formData = await request.formData();
    //console.log(formData.get('nombre'))
    //console.log(...formData);
    const datos = Object.fromEntries(formData);

    //Validacion de datos
    const errores = [];
    if (Object.values(datos).includes("")) {
        errores.push("Todos los campos son obligatorios.");
    }

    //Validar email
    let regex = new RegExp(
        "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
    );
    /* if (!regex.test(email)) {
        errores.push("El Email no es válido.");
    } */

    //Retornar datos si hay errores
    if (Object.keys(errores).length) {
        return errores;
    }

    //actualizar el cliente
    await actualizarCliente(params.clienteId, datos);
    return redirect("/");
}

function EditarCliente() {
    const navigate = useNavigate();
    const cliente = useLoaderData();
    const errores = useActionData();
    return (
        <>
            <h1 className="font-black text-4xl text-blue-900">
                Editar Cliente
            </h1>
            <p className="mt-3">Modificando los datos de un cliente.</p>

            <div className="flex justify-end">
                <button
                    className="bg-blue-800 text-white px-3 py-1 font-bold uppercase"
                    onClick={() => navigate(-1)}
                >
                    VOLVER
                </button>
            </div>
            <div className="bg-white shadow rounded-md md:w-3/4 mx-auto px-5 py-10 ">
                {errores?.length &&
                    errores.map((error, i) => <Error key={i}>{error}</Error>)}
                <Form method="post" noValidate>
                    <Formulario cliente={cliente} />

                    <input
                        type="submit"
                        value="Guardar cambios"
                        className="mt-5 w-full bg-blue-800 p-3 uppercase font-bold text-white text-lg"
                    />
                </Form>
            </div>
        </>
    );
}

export default EditarCliente;
