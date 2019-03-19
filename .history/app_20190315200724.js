//01-MODULOS INDIVIDUALES MODULO CONTROLADOR })();
var controladorPresupuesto = (function () {

    var Gastos = function (id, descripcion, valor) {

        this.id = id;
        this.descripcion = descripcion;
        this.valor = valor;
    };

    var Ingreso = function (id, descripcion, valor) {

        this.id = id;
        this.descripcion = descripcion;
        this.valor = valor;
    };

    var data = {

        todoslosItems: {
            income: [],
            expenses: []

        },
        totales: {
            income: 0,
            expenses: 0

        }

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
            if (ty === 'income') {
                nuevoItem = new Ingreso(ID, des, val);
            } else if (ty === 'expenses') {
                nuevoItem = new Gasto(ID, des, val);
            }
            // Agregamos al array los datos ingresados segun sean si es un inncome o expence        
            data.todoslosItems[ty].push(nuevoItem);
            // Para que tengamos acceso a el objeto que acabamos de crear 
            return nuevoItem;

        },


    };

    //some code

})();
//02-MODULO CONNTROLADOR INTERFAS USUARIO UI })();
var controladorUI = (function () {
    // DOM es el que inntereactua con html y javascriot
    var DOMclasshtml = {

        entradaTipo: '.add__type',
        entradaDescripcion: '.add__description',
        entradaDinero: '.add__value',
        entradaboton: '.add__btn',
        contenedorIngreso: '.income__list',
        contenedorGasto: '.expenses__list',

    }


    return {
        // funcion que recibe el tipo de valor, la descripciòn y dinero. 
        tomarinfoentrada: function () {
            return {
                tipo: document.querySelector(DOMclasshtml.entradaTipo).value, // Recibimos inc(+) or exp(-) 
                descripcion: document.querySelector(DOMclasshtml.entradaDescripcion).value, // Recibimos el texto descripciòn
                dinero: document.querySelector(DOMclasshtml.entradaDinero).value, // recibimos el valor 
                // Esto es unn objeto que devuelve las tres propiedades 
            };
        },

        agregarListaItem: function (obj, type) {
            var html, newhtml;
            // 01- Crear html 

            if (tipo === 'income') {
                element = DOMclasshtml.contenedorIngreso;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%descripcion%</div><div class="right clearfix"><div class="item__value">%valor%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (tipo === 'expenses') {
                element = DOMclasshtml.contenedorGasto;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%descripcion%</div><div class="right clearfix"><div class="item__value">%valor%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Remplazar el html con el cambio de info de la funcion connstructor Gasto
            // No me queda claro porque el primero es Html y los otros dos tiene que ser newhtml, si todos se colocan como newhtml da error. 
            newhtml = html.replace('%id%', obj.id);
            newhtml = newhtml.replace('%descripcion%', obj.descripcion);
            newhtml = newhtml.replace('%valor%', obj.valor);

            // Insertar el html en el DOM 
            // esto hace que todo nuestra innfo se inserte en los contenedores de lista de ingresos y gastos. 
            document.querySelector(element).insertAdjacentHTML('beforeend', newhtml);





        },





        ///Con esto hacemos el DOM publico para que sea consultado por otros metodos. 
        tomarDOM: function () {
            return DOMclasshtml;
        }


    };

    //some code



})();

//03-MODULO CONTROLADOR APP PRINCIPAL
var controladorApp = (function (contPresupuesto, contUI) {

    var configEventListener = function () {
        var DOM = controladorUI.tomarDOM(); // Tengo que poner los parentesis al final ya que esta haciedo una llamada.    
        //Seleccionamos el boton añadir con class del boton html que en este caso es .add__btn, luego le agregamos un escuchador de eventos para que ocurra algo cuando suceda el evento en este caso un click y luego la funcion que queremos que ejecute.  
        // evento para el click en el botonn add, hace lo que este escrito en cotnrolAddBoton
        document.querySelector(DOM.entradaboton).addEventListener('click', controlAddItem);
        /// Evento para la tecla enter  hace lo que este escrito en cotnrolAddBoton  
        document.addEventListener('keypress', function (evento) {
            // 13 es el codigo de la tecla enter, asi solo funciona al presionar enter, keycode hace referencia ala tecla, en los navegadores viejos utilizan el comando which asi que utilziamos || que es or para decir que funcione en cualquiera de los dos casos. 
            if (evento.keyCode === 13 || evento.which === 13) {
                controlAddItem();
            }

        });
    }



    var controlAddItem = function () {
        var entrada, nuevoItem;
        // Cuando alguien haga click en el boton + necesitamos

        // 01. Conseguir la info de entrada
        // Con esta variable conectamos la funciòn de entrada de tezto con este modulo. 
        entrada = controladorUI.tomarinfoentrada();


        // 02. Agregar el item a el conntrolador de presupuesto
        // Llamamos el metodo agreItem de el Modulo Controlador de Presupuesto.
        nuevoItem = controladorPresupuesto.agreItem(entrada.tipo, entrada.descripcion, entrada.dinero);


        // 03. Agregar el item a  UI para verlo.
        //Lo que nos permite ver el gasto o ingres ode  forma visual 
        controladorUI.agregarListaItem(nuevoItem, entrada.tipo);

        // 04. Calcular el presupuesto.




        // 05. Mostrar el Presupuesto en UI para verlo. 

    };
    // Funciòn publica de iniciaciòn. Para iniciar los Event Listennner 
    return {
        init: function () {
            console.log('La aplicación se inicio');
            configEventListener();
        }
    }

    //Estos dos le dice que contPresupuesto es igual a  ControladorPresupuesto y ContUI es controladorUI a nivel externo. Asi queda conectado con los dos modulos exteriores 01 y 02.   
})(controladorPresupuesto, controladorUI);

//LLamamos a init desde el exterior para iniciar la app 
controladorApp.init();