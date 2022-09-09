// 2.- Consumir con fetch o jQuery la API local para obtener los datos de todos los países
//     usando el siguiente endpoint.
$.ajax({
    type: 'GET',
    url: `http://localhost:3000/api/total/`,
    success: (data) => {
        // Se haya el pais con mayores casos activos con el metodo Sort.
        data.sort(function (a, b) {
            if (a.active < b.active) {
                return 1;
            };
            if (a.active > b.active) {
                return -1;
            };
            return 0;
        });
        console.log(data);

        // Se captura data con los paises con mas casos activos (tabla).
        let paisesOrdenados = data.sort();

        // Variable de un arreglo vacio totalPaises.
        let totalPaises = [];

        // Se separan los 10 paises con mas casos activos con el metodo for.
        const paisesGrafico = (paisesOrdenados) => {
            const ids = [];
            for (let i = 0; i < 10; i++) {
                ids.push(paisesOrdenados[i]);
            };
            return ids;
        };
        totalPaises = paisesGrafico(data);

        // Arreglo de Casos Activos.
        let arregloCasosActivos = [];
        totalPaises.forEach(function (item) {
            arregloCasosActivos.push(
                {
                    label: item.country,
                    y: item.active
                    
                }
            );
        });
        // Arreglo de Casos Confirmados.
        let arregloCasosConfirmados = [];
        totalPaises.forEach(function (item) {
            arregloCasosConfirmados.push(
                {
                    label: item.country,
                    y: item.confirmed
                }
            );
        });
        // Arreglo de Casos Muertos.
        let arregloCasosMuertos = [];
        totalPaises.forEach(function (item) {
            arregloCasosMuertos.push(
                {
                    label: item.country,
                    y: item.deaths
                }
            );
        });
        // Arreglo de Casos Recuperados.
        let arregloCasosRecuperados = [];
        totalPaises.forEach(function (item) {
            arregloCasosRecuperados.push(
                {
                    label: item.country,
                    y: item.recovered
                }
            );
        });

        // 3. Desplegar la información de la API en un gráfico de barra que debe mostrar sólo los
        //    10 países con más casos activos.
        window.onload = function () {
            var chart = new CanvasJS.Chart("chartContainerUno", {
                exportEnabled: true,
                animationEnabled: true,
                title: {
                    text: "Paises Con Mas Casos Activos"
                },
                axisX: {
                    title: "Paises"
                },
                toolTip: {
                    shared: true
                },
                legend: {
                    cursor: "pointer",
                    itemclick: toggleDataSeries
                },
                data: [{
                    type: "column",
                    name: "Casos Activos",
                    showInLegend: true,
                    yValueFormatString: "#,##0.# Units",
                    dataPoints: arregloCasosActivos,
                },
                {
                    type: "column",
                    name: "Casos Confirmados",
                    showInLegend: true,
                    yValueFormatString: "#,##0.# Units",
                    dataPoints: arregloCasosConfirmados,
                },
                {
                    type: "column",
                    name: "Casos Muertos",
                    showInLegend: true,
                    yValueFormatString: "#,##0.# Units",
                    dataPoints: arregloCasosMuertos,
                },
                {
                    type: "column",
                    name: "Casos Recuperados",
                    showInLegend: true,
                    yValueFormatString: "#,##0.# Units",
                    dataPoints: arregloCasosRecuperados,
                }]
            });
            chart.render();

            function toggleDataSeries(e) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                };
                e.chart.render();
            };

            // 4. Desplegar debajo del gráfico de barras una tabla con la información de todos los
            //    países ordenados alfabéticamente por el nombre del país.
            function listas(element, indice) {
                document.getElementById('dtBasicExample').innerHTML += `
                    <tr>
                        <td>${element.country}</td>
                        <td >${element.active}</td>
                        <td >${element.confirmed}</td>
                        <td >${element.deaths}</td>
                        <td >${element.recovered}</td>
                        <td><button class="myBtn" type="button" data-toggle="modal" data-target="#myModal">Ver Detalles</button></td>
                    </tr>
                `;
            };

            // Codifica data Paises pero en Orden Alfabetico.
            data.sort(function (a, b) {
                if (a.country > b.country) {
                    return 1;
                };
                if (a.country < b.country) {
                    return -1;
                };
                return 0;
            });
            // Alimenta la tabla con la data de los Paises en Orden Alfabetico.
            data.forEach((element, indice) => {
                listas(element, indice);
            });

            // 5. En cada fila de la tabla se debe incluir un botón “Ver detalles” que abra una ventana
            //    Modal muestre los datos del país en un gráfico circular.
            // Se captura la info al hacer click en el boton myBtn con addEventListener.
            document.querySelectorAll('#dtBasicExample .myBtn').forEach((b) => b.addEventListener('click', function (e) {
                const padre = e.target.parentElement.parentElement;

                // Variables que captan la info de los hijos de la constante padre.
                let pais = padre.childNodes[1].innerHTML;
                let activos = padre.childNodes[3].innerHTML;
                let confirmados = padre.childNodes[5].innerHTML;
                let muertos = padre.childNodes[7].innerHTML;
                let recuperados = padre.childNodes[9].innerHTML;

                // Grafico Torta.
                var chart = new CanvasJS.Chart("chartContainerDos", {
                    theme: "light2", // "light1", "light2", "dark1", "dark2"
                    exportEnabled: true,
                    animationEnabled: true,
                    title: {
                        text: pais
                    },
                    data: [{
                        type: "pie",
                        startAngle: 25,
                        toolTipContent: "<b>{label}</b>: {y}%",
                        showInLegend: "true",
                        legendText: "{label}",
                        indexLabelFontSize: 16,
                        indexLabel: "{label} - {y}%",
                        dataPoints: [
                            { y: parseInt(activos), label: "Casos Activos" },
                            { y: parseInt(confirmados), label: "Casos Confirmados" },
                            { y: parseInt(muertos), label: "Casos Muertos" },
                            { y: parseInt(recuperados), label: "Casos Recuperados" }
                        ]
                    }]
                });
                chart.render();
            }));
        };
    }
});