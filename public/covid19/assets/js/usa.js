// Utilizar la siguiente ruta del navegador para revisar el desafío: http://localhost:3000/covid19.

// 2. Enviar los datos del usuario al servidor para obtener un token JWT.
$('#formulario').submit(async (event) => {
    event.preventDefault();
    // Se captura la info en las constantes email y password.
    const email = document.getElementById('email').value
    const password = document.getElementById('contrasena').value
    //console.log('email', email);
    //console.log('password', password);

    // Se agrega el metodo postData a la constante JWT.
    const JWT = await postData(email, password);
    //console.log('JWT', JWT);

    // Se llama a la funcion getData.
    getData(JWT);
});

// Se envia datos a la API y se captura el JWT.
const postData = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password })
            });
        const { token } = await response.json();
        // 5. Persistir el token utilizando localStorage.setItem('jwt-token', token).
        localStorage.setItem('jwt-token', token);
        return token
    } catch (err) {
        console.error(`Error: ${err}`);
    };
};

// 5. Persistir el JWT en LocalStorage y utilizarlo al recargar la página para obtener el
//    historial y renderizar la gráfica(Opcional).
// Funcion init (se va a ejecutar al cargar la pagina (linea 178) y valida si existe un JWT).
const init = async () => {
    const token = localStorage.getItem('jwt-token');
    if (token) {
        getData(token);
    };
};

// Variables que alimentaran los dataPoints de la grafica.
let casosPositivos = [];
let casosNegativos = [];
let casosMuertos = [];

// 3. Con el token obtenido consultar al servidor y obtener el historial de datos de Estados Unidos.
// Funcion getData.
const getData = async (jwt) => {
    try {
        const response = await fetch(`http://localhost:3000/api/country/usa`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt} `
                }
            });
        // Si el estatus de respuesta es distinto a 200, muestra un error en token.
        if (response.status != 200) {
            throw new Error(" en token");
        };
        const data = await response.json();
        //console.log(data);

        if (data) {
            // 6. Se ejecuta funcion toggleButtonAndForm (linea 183) con las 2 id del HTML que cambia
            //    entreo cultar el formulario y mostrar el boton de Cerrar Sesion si hay data.
            toggleButtonAndForm('ocultarForm', 'botonDisplay');

            // Arreglo por fecha de menor a mayor con el Metodo Sort.
            data.sort(function (a, b) {
                return a.date - b.date;
            });
            //console.log('Organizado por Fechas', data);

            // Se aplica metodo forEach a data para alimentar el grafico.            
            data.forEach(element => {
                // Variables con los Datos Ordenados.
                let datosFecha = element.date;
                let datosPositivo = element.positive;
                let datosNegativo = element.negative;
                let datosMuerto = element.deaths;
                console.log('datosFecha',datosFecha);
                //console.log('datosPositivo', datosPositivo);
                //console.log('datosNegativo', datosNegativo);
                //console.log('datosMuerto', datosMuerto);

                // Con el push, se adjuntan datos a las variables (linea 49-51) que alimentaran los dataPoints.
                casosPositivos.push(
                    {
                        label: datosFecha,
                        y: datosPositivo
                    }
                );
                casosNegativos.push(
                    {
                        label: datosFecha,
                        y: datosNegativo
                    }
                );
                casosMuertos.push(
                    {
                        label: datosFecha,
                        y: datosMuerto
                    }
                );

                // 4. Renderizar una gráfica de líneas con los datos del historial.
                // Grafico de Lineas.
                var chart = new CanvasJS.Chart("chartContainerTres", {
                    animationEnabled: true,
                    exportEnabled: true,
                    title: {
                        text: "Casos Covid19 2020-2021 USA"
                    },
                    axisY: {
                        title: "Numero de Casos"
                    },
                    toolTip: {
                        shared: true
                    },
                    legend: {
                        cursor: "pointer",
                        itemclick: toggleDataSeries
                    },
                    data: [{
                        type: "spline",
                        name: "Casos Positivos",
                        showInLegend: true,
                        dataPoints: casosPositivos,
                    },
                    {
                        type: "spline",
                        name: "Casos Negativos",
                        showInLegend: true,
                        dataPoints: casosNegativos,
                    },
                    {
                        type: "spline",
                        name: "Fallecidos",
                        showInLegend: true,
                        dataPoints: casosMuertos,
                    },
                    ]
                });
                chart.render();

                function toggleDataSeries(e) {
                    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                        e.dataSeries.visible = false;
                    }
                    else {
                        e.dataSeries.visible = true;
                    };
                    chart.render();
                };
            });
        };
        //console.log('fechas', fechas);
        //console.log('casosPositivos', casosPositivos);
        //console.log('casosNegativos', casosNegativos);
        //console.log('casosMuertos', casosMuertos);
    }
    catch (err) {
        // 6. Para limpiar el localStorage, se agrega dentro del catch localStorage.clear().
        localStorage.clear();
        console.error(`${err}`)
    };
};

// Ejecuta la funcion init (linea 41).
init();

// 6. Agregar un botón “Cerrar sesión” en el Menú de navegación al realizar el login
//    exitosamente. Deberá eliminar el JWT de LocalStorage y recargar la página(Opcional).
// Se crea const con funcion toggleButtonAndForm que oculta el formulario y muestra el boton.
const toggleButtonAndForm = (form, boton) => {
    $(`#${form}`).toggle();
    $(`#${boton}`).toggle();
};
// Se asigna funcion al hacer click en el boton Cerrar Sesion.
$('#cerrarSesion').click(function () {
    // Limpia la persistencia del JWT.
    localStorage.clear();
    // Refesca la pagina a su estado original.
    location.reload();
});