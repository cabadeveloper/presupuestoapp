//Comentarios
// * todo es importante
// ? es importante
// ! es muy importante 
// TODO: Pendiente por hacer


// TODO:01-MODULOS INDIVIDUALES MODULO CONTROLADOR })();

var controladorPresupuesto = (function () {
  var Gasto = function (id, descripcion, valor, porcentaje) {
    this.id = id;
    this.descripcion = descripcion;
    this.valor = valor;
    this.porcentaje = -1;
  };

  Gasto.prototype.calcuPorcentaje = function (totaling) {
    if (totaling > 0) {
      this.porcentaje = Math.round((this.valor / totaling) * 100);
    } else {
      this.porcentaje = -1;
    }
  };

  Gasto.prototype.tomarPorcentajes = function () {
    return this.porcentaje;
  };

  var Ingreso = function (id, descripcion, valor) {
    this.id = id;
    this.descripcion = descripcion;
    this.valor = valor;
  };
  var calcularTotal = function (type) {
    var sum = 0;
    data.todoslosItems[type].forEach(function (act) {
      // Funciona asi  sum es 0 mas [200,400,100]
      // sum = 0 + 200 =
      // sum = 200 + 400
      // sum = 600 + 100
      //suma mas el valor actual
      sum = sum + act.valor;
    });
    data.totales[type] = sum;
  };

  var data = {
    todoslosItems: {
      income: [],
      expenses: []
    },
    totales: {
      income: 0,
      expenses: 0
    },
    presupuesto: 0,
    // Se pone -1 porque si no hay dATOS NO PUEDE EXISTIR PORCENTAJE, -1 HACE REFERENNCIA A QUE NO EXISTE
    porcentaje: -1
  };
  /// Aqui estamos recibiendo la informaciòn incial de la app
  return {
    agreItem: function (ty, des, val) {
      var nuevoItem, ID;
      // ID es un codigo que agregamos a cad gasto o ingreso
      // Nuevo ID
      // Item actual        // ultimo item -1 es porque comienza el connteo desde 0, y a  eso le agregamos 1 para que aumennte la numeraciòn del ID

      if (data.todoslosItems[ty].length > 0) {
        ID = data.todoslosItems[ty][data.todoslosItems[ty].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Creamos unn nuevo Item desde la info ingresada.
      if (ty === "income") {
        nuevoItem = new Ingreso(ID, des, val);
      } else if (ty === "expenses") {
        nuevoItem = new Gasto(ID, des, val);
      }
      // Agregamos al array los datos ingresados segun sean si es un inncome o expense
      data.todoslosItems[ty].push(nuevoItem);
      // Para que tengamos acceso a el objeto que acabamos de crear
      return nuevoItem;
    },
    //Esto es un metodo qu se puede usar luego .borraritem() llamandolo
    borrarItem: function (type, id) {
      var ids, index;
      // para borrar necesitamos saber si es un gato o un ignreso y el id
      //data.todoslosItems[type][id];

      //mapa leey devuelve una nueva matriz con la info requerida
      ids = data.todoslosItems[type].map(function (current) {
        return current.ids;
      });
      index = ids.indexOf(id);

      if (index !== 1) {
        data.todoslosItems[type].splice(index, 1);
      }
    },

    calculoPresupuesto: function () {
      // Calculamos el total de los ingresos y gastos
      calcularTotal("expenses");
      calcularTotal("income");
      // Calculamos el presupuesto: ingresos - gastos
      data.presupuesto = data.totales.income - data.totales.expenses;
      // Calculamos el porcentaje de ingresos que gastamos
      // Creamos la formula de porcentaje y redondeamos el valor con Math.round

      if (data.totales.income > 0) {
        data.porcentaje = Math.round(
          (data.totales.expenses / data.totales.income) * 100
        );
      } else {
        data.porcentaje = -1;
      }
    },

    calculoPorcentajes: function () {
      data.todoslosItems.expenses.forEach(function (actual) {
        actual.calcuPorcentaje(data.totales.income);
      });
    },

    tomarPorcentaje: function () {
      var todosPorce = data.todoslosItems.expenses.map(function (actual) {
        return actual.tomarPorcentajes();
      });

      return todosPorce;
    },

    tomarPresupuesto: function () {
      return {
        presupuesto: data.presupuesto,
        totaling: data.totales.income,
        totalgast: data.totales.expenses,
        porcentajes: data.porcentaje
      };
    },

    //Con esto testeamos la aplicaciòn con el comando controladordepresupuesto.testinng() enn la consola de javascript
    testing: function () {
      console.log(data);
    }
  };

  //some code
})();

// TODO: 02-MODULO CONNTROLADOR INTERFAS USUARIO UI })();

var controladorUI = (function () {
  // DOM es el que inntereactua con html y javascriot
  var DOMclasshtml = {
    entradaTipo: ".add__type",
    entradaDescripcion: ".add__description",
    entradaDinero: ".add__value",
    entradaboton: ".add__btn",
    contenedorIngreso: ".income__list",
    contenedorGasto: ".expenses__list",
    presupuestoEtiqueta: ".budget__value",
    ingresoEtiqueta: ".budget__income--value",
    gastoEtiqueta: ".budget__expenses--value",
    porcentajeEtiqueta: ".budget__expenses--percentage",
    contenedor: ".container",
    gastosPorcentajeEtiqueta: ".item__percentage",
    fechaEtiqueta: ".budget__title--month"
  };

  var formatoNumero = function (num, type) {
    var numSplit;
    num = Math.abs(num);
    // Pone dos decimales a los numeros y los redondea dejando dos decimales
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    if (int.length > 3) {
      //comienza en la posicion cero y lee un caracter luego vamos a la posicion 1 y leemos 3 numeros 
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length); // si el numero es 2310  ,  resultado es 2,310

    }

    dec = numSplit[1];


    return (type === "expenses" ? '-' : '+') + ' ' + int + '.' + dec;

  };

  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);



    }

  };

  return {
    // funcion que recibe el tipo de valor, la descripciòn y dinero.
    tomarinfoentrada: function () {
      return {
        tipo: document.querySelector(DOMclasshtml.entradaTipo).value, // Recibimos inc(+) or exp(-)
        descripcion: document.querySelector(DOMclasshtml.entradaDescripcion)
          .value, // Recibimos el texto descripciòn
        //Es valor es un string y con ParseFloat lo convertimos en Numero
        dinero: parseFloat(
          document.querySelector(DOMclasshtml.entradaDinero).value
        ) // recibimos el valor
        // Esto es unn objeto que devuelve las tres propiedades
      };
    },

    agregarListaItem: function (obj, type) {
      var html, newhtml;
      // 01- Crear html

      if (type === "income") {
        element = DOMclasshtml.contenedorIngreso;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%descripcion%</div><div class="right clearfix"><div class="item__value">%valor%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "expenses") {
        element = DOMclasshtml.contenedorGasto;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%descripcion%</div><div class="right clearfix"><div class="item__value">%valor%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // Remplazar el html con el cambio de info de la funcion connstructor Gasto
      // No me queda claro porque el primero es Html y los otros dos tiene que ser newhtml, si todos se colocan como newhtml da error.
      newhtml = html.replace("%id%", obj.id);
      newhtml = newhtml.replace("%descripcion%", obj.descripcion);
      newhtml = newhtml.replace("%valor%", formatoNumero(obj.valor, type));

      // Insertar el html en el DOM
      // esto hace que todo nuestra innfo se inserte en los contenedores de lista de ingresos y gastos.
      document.querySelector(element).insertAdjacentHTML("beforeend", newhtml);
    },

    borrarListaItem: function (selectorID) {
      // https://blog.garstasio.com/you-dont-need-jquery/dom-manipulation/ Removing Elements
      document
        .getElementById(selectorID)
        .parentNode.removeChild(document.getElementById(selectorID));
    },

    limpiadorDeCampos: function () {
      var campos, camposArr;

      campos = document.querySelectorAll(
        DOMclasshtml.entradaDescripcion + "," + DOMclasshtml.entradaDinero
      );

      camposArr = Array.prototype.slice.call(campos);

      camposArr.forEach(function (current, index, array) {
        current.value = "";
      });
      camposArr[0].focus();
    },



    mostrarPresupuesto: function (objeto) {

      objeto.presupuesto > 0 ? type = "income" : type = "expense";

      document.querySelector(DOMclasshtml.presupuestoEtiqueta).textContent =
        formatoNumero(objeto.presupuesto, type);
      document.querySelector(DOMclasshtml.ingresoEtiqueta).textContent =
        formatoNumero(objeto.totaling, "income");
      document.querySelector(DOMclasshtml.gastoEtiqueta).textContent =
        formatoNumero(objeto.totalgast, "expense");

      if (objeto.porcentajes > 0) {
        document.querySelector(DOMclasshtml.porcentajeEtiqueta).textContent =
          objeto.porcentajes + "%";
      } else {
        document.querySelector(DOMclasshtml.porcentajeEtiqueta).textContent =
          "---";
      }
    },
    mostrarPorcentajes: function (porcentajes) {

      var campos = document.querySelectorAll(DOMclasshtml.gastosPorcentajeEtiqueta);



      nodeListForEach(campos, function (actual, index) {
        //Do someting 
        if (porcentajes[index] > 0) {
          actual.textContent = porcentajes[index] + "%";


        } else {
          actual.textContent = "---";
        }




      });




    },


    mostrarFecha: function () {
      var now, month, year;


      now = new Date(); // Este metodo ya esta definnido en JS


      meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];



      month = now.getMonth();
      year = now.getFullYear(); // este metodo ya esta definido en Javascritp, por eso lo dejo en ingles
      document.querySelector(DOMclasshtml.fechaEtiqueta).textContent = meses[month] + ' ' + year;



    },

    cambiodeTipo: function () {

      var campos = document.querySelectorAll(

        DOMclasshtml.entradaTipo + ',' +
        DOMclasshtml.entradaDescripcion + ',' +
        DOMclasshtml.entradaDinero);



    },

    ///Con esto hacemos el DOM publico para que sea consultado por otros metodos.
    tomarDOM: function () {
      return DOMclasshtml;
    }
  };

  //some code
})();

//TODO:03-MODULO CONTROLADOR APP PRINCIPAL
var controladorApp = (function (contPresupuesto, contUI) {
  var configEventListener = function () {
    var DOM = controladorUI.tomarDOM(); // Tengo que poner los parentesis al final ya que esta haciedo una llamada.
    //Seleccionamos el boton añadir con class del boton html que en este caso es .add__btn, luego le agregamos un escuchador de eventos para que ocurra algo cuando suceda el evento en este caso un click y luego la funcion que queremos que ejecute.
    // evento para el click en el botonn add, hace lo que este escrito en cotnrolAddBoton
    document
      .querySelector(DOM.entradaboton)
      .addEventListener("click", controlAddItem);
    /// Evento para la tecla enter  hace lo que este escrito en cotnrolAddBoton
    document.addEventListener("keypress", function (evento) {
      // 13 es el codigo de la tecla enter, asi solo funciona al presionar enter, keycode hace referencia ala tecla, en los navegadores viejos utilizan el comando which asi que utilziamos || que es or para decir que funcione en cualquiera de los dos casos.
      if (evento.keyCode === 13 || evento.which === 13) {
        controlAddItem();
      }
    });

    document.querySelector(DOM.contenedor).addEventListener("click", controlBorrarItem);

    document.querySelector(DOM.inputType).addEventListener("change", controladorUI.cambiodeTipo);




  };

  var actualizacionPorcentajes = function () {
    // 01. Calcular el porcentaje
    controladorPresupuesto.calculoPorcentajes();

    // 02. Leer porcentajes de el controlador de presupuesto

    var porcentajes = controladorPresupuesto.tomarPorcentaje();

    //03. Actualizar ui

    controladorUI.mostrarPorcentajes(porcentajes);
  };

  var actualizacionPresupuesto = function () {
    // 01. Calcular el presupuesto.
    controladorPresupuesto.calculoPresupuesto();

    // 02 Retornar el Presupuesto
    var presupuesto = controladorPresupuesto.tomarPresupuesto();

    // 03. Mostrar el Presupuesto en UI para verlo.
    controladorUI.mostrarPresupuesto(presupuesto);
  };

  var controlAddItem = function () {
    var entrada, nuevoItem;
    // Cuando alguien haga click en el boton + necesitamos

    // 01. Conseguir la info de entrada
    // Con esta variable conectamos la funciòn de entrada de tezto con este modulo.
    entrada = controladorUI.tomarinfoentrada();

    if (
      entrada.descripcion !== " " &&
      !isNaN(entrada.dinero) &&
      entrada.dinero > 0
    ) {
      // 02. Agregar el item a el conntrolador de presupuesto
      // Llamamos el metodo agreItem de el Modulo Controlador de Presupuesto.
      nuevoItem = controladorPresupuesto.agreItem(
        entrada.tipo,
        entrada.descripcion,
        entrada.dinero
      );


      // 03. Agregar el item a  UI para verlo.
      //Lo que nos permite ver el gasto o ingres ode  forma visual
      controladorUI.agregarListaItem(nuevoItem, entrada.tipo);

      //04. Limpiar los campos ( no esta funcionanndo no se porque =,()

      controladorUI.limpiadorDeCampos();
      // 05. Calcular y actualzar el presupuesto
      actualizacionPresupuesto();
      // 06. Actualizar Presupuesto.
      actualizacionPorcentajes();
    }
  };

  var controlBorrarItem = function (evento) {
    var itemID, splitID, type, ID;
    // borbuja
    itemID = evento.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);
      // 1. Borrar el item de la estructura de data

      controladorPresupuesto.borrarItem(type, ID);

      // 2. Borrar el item de el UI
      controladorUI.borrarListaItem(itemID);

      // 3. Actualizar y mostrar el nuevo presupuesto.

      actualizacionPresupuesto();

      // 4. Actualizar porcentajes

      actualizacionPorcentajes();
    }
  };

  // Funciòn publica de iniciaciòn. Para iniciar los Event Listennner
  return {
    init: function () {
      console.log("La aplicación se inicio");
      //Pone el contador en cero
      controladorUI.mostrarFecha();
      controladorUI.mostrarPresupuesto({
        presupuesto: 0,
        totaling: 0,
        totalgast: 0,
        porcentajes: -1
      });
      configEventListener();
    }
  };

  //Estos dos le dice que contPresupuesto es igual a  ControladorPresupuesto y ContUI es controladorUI a nivel externo. Asi queda conectado con los dos modulos exteriores 01 y 02.
})(controladorPresupuesto, controladorUI);

//LLamamos a init desde el exterior para iniciar la app
controladorApp.init();