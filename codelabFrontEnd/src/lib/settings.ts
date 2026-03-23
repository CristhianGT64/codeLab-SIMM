export default {
    // URL: "https://api-pokequequepcaiii-dev.azurewebsites.net",
    //URL : "http://localhost:3000", // Para consumir api local
    prueba : "https://pokeapi.co/api/v2", // Para pruebas locales
    URL : "https://api-codelab-unah.ambitiouswave-de8b838a.southcentralus.azurecontainerapps.io", // Consumir api de db actual
    year : new Date().getFullYear()
};

export const formatFecha = (iso: string) =>
    new Date(iso).toLocaleString("es-GT", {
      dateStyle: "short",
      timeStyle: "short",
    });