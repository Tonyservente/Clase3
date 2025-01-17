
var productos = [];

class Producto {
    constructor({id, nombre , precio , foto }) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.foto = foto;
    }
}

class ElementoCarrito {
    constructor(producto, cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
    }
}

// En caso de utilizar una API utilizo los siguientes datos

// class Producto {
//     constructor({id, title , price , images }) {
//         this.id = id;
//         this.nombre = title;
//         this.precio = price;
//         this.foto = images[0];
//     }
// }
// loadData()


// async function loadData(value=""){

//     try{
//         const data = await fetch('https://dummyjson.com/products/search?q=' + value);
//         const dataProductos = await data.json()
//         console.log(dataProductos.products)
//         const productsList = dataProductos.products
//         productos = [];
//         productsList.forEach(producto => {
//             productos.push(new Producto(producto))
//         });
//         dibujarCatalogoProductos();

//     }catch(error){
        
//        console.log('esto es un error', error)
//     }
// }

// document.getElementById('buscar').addEventListener("click" , (e) => {
//     e.preventDefault();
//     console.log("evento");
//     const value = document.getElementById('input__buscar').value
//     loadData(value)
// });
  


//Leo los productos desde productos.json y los cargo al array elementos del carrito

laodData("./productos.json")


async function laodData(ruta){

    try{
        const loadData = await fetch(ruta);

        const data = await loadData.json()

        data.forEach(producto => {
            productos.push(new Producto(producto))
        });
        dibujarCatalogoProductos();

    }catch(error){
        
       console.log('esto es un error', error)
    }
}

// Otra forma de leer productos.json

// fetch("./produtos.json")
// .then(response => response.json())
// .then(data => {
//     data.forEach(producto => {
//         productos.push(new Producto(producto))
//     });
//     dibujarCatalogoProductos();
// }).catch(error => console.log(error));



//Definiciones de constantes

const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarritoCompras = document.querySelector("#items")
const contenedorFooterCarrito = document.querySelector("#footer");
const estandarDolaresAmericanos = Intl.NumberFormat('en-US');

//Arrays donde guardaremos catálogo de productos y elementos en carrito

const elementosCarrito = [];



 //Ejecución de funciones

cargarCarrito();
if (localStorage.getItem('carrito')){
    let carrito=JSON.parse(localStorage.getItem('carrito'));
    for (var i=0; i <carrito.length;i++){
        elementosCarrito.push(new ElementoCarrito(carrito[i].producto, carrito[i].cantidad));
    }
}

dibujarCarrito();
dibujarCatalogoProductos();

 //Definiciones de funciones

function cargarCarrito() {
    /*let elementoCarrito = new ElementoCarrito(
        new Producto(1, 'Moña', 150, './img/muffin.jpg'),
        1
    );

    elementosCarrito.push(elementoCarrito);*/
}

function vaciarCarrito() {
    elementosCarrito.length = 0;
    dibujarCarrito();
}

function dibujarCarrito() {
    contenedorCarritoCompras.innerHTML = "";

    elementosCarrito.forEach(
        (elemento) => {
            let renglonesCarrito= document.createElement("tr");
            
            renglonesCarrito.innerHTML = `
                <td>${elemento.producto.id}</td>
                <td>${elemento.producto.nombre}</td>
                <td><input id="cantidad-producto-${elemento.producto.id}" type="number" value="${elemento.cantidad}" min="1" max="1000" step="1" style="width: 50px;"/></td>
                <td>$ ${elemento.producto.precio}</td>
                <td>$ ${estandarDolaresAmericanos.format(elemento.producto.precio*elemento.cantidad)}</td>
                <td><button id="eliminar-producto-${elemento.producto.id}" type="button" class="btn btn-danger"><i class="bi bi-trash-fill"></i></button></td>
                
            `;

            contenedorCarritoCompras.append(renglonesCarrito);

            //Agregar evento a input de renglón en carrito
            let inputCantidadProducto = document.getElementById(`cantidad-producto-${elemento.producto.id}`);
            inputCantidadProducto.addEventListener('change', (ev) => {
                let nuevaCantidad = ev.target.value;
                elemento.cantidad = nuevaCantidad;

                dibujarCarrito();
            });

            //Agregar evento a eliminar producto
            let botonEliminarProducto = document.getElementById(`eliminar-producto-${elemento.producto.id}`);
            botonEliminarProducto.addEventListener('click', () => {
                //alert("Hicimos click" + elementosCarrito.indexOf(elemento));

                let indiceEliminar =  elementosCarrito.indexOf(elemento);
                elementosCarrito.splice(indiceEliminar,1);
                
                dibujarCarrito();
            });
            
        }
    );
    
    const valorInicial = 0;
    const totalCompra = elementosCarrito.reduce(
        (previousValue, currentValue) => previousValue + currentValue.producto.precio*currentValue.cantidad,
        valorInicial
    );

    if(elementosCarrito.length == 0) {
        contenedorFooterCarrito.innerHTML = `<th scope="row" colspan="6">Carrito vacío - comience a comprar!</th>`;
    } else {
        contenedorFooterCarrito.innerHTML = `<th scope="row" colspan="6">Total de la compra: ${totalCompra}</th>`;
    }

}

function crearCard(producto) {
    //Botón
    let botonAgregar = document.createElement("button");
    botonAgregar.className = "btn btn-success";
    botonAgregar.innerText = "Agregar";

    //Card body
    let cuerpoCarta = document.createElement("div");
    cuerpoCarta.className = "card-body";
    cuerpoCarta.innerHTML = `
        <h5>${producto.nombre}</h5>
        <p>$ ${producto.precio} Pesos</p>
    `;
    cuerpoCarta.append(botonAgregar);

    //Imagen
    let imagen = document.createElement("img");
    imagen.src = producto.foto;
    imagen.className = "card-img-top";
    imagen.alt = producto.nombre;
    imagen.style = "width: 200px; height: 200px;"
    let carta = document.createElement("div");
    carta.className = "card m-2 p-2";
    carta.style = "width: 18rem";
    carta.append(imagen);
    carta.append(cuerpoCarta);

    //Contenedor Card
    //let contenedorCarta = document.createElement("div");
    //contenedorCarta.className = "col-xs-6 col-sm-3 col-md-2";
    //contenedorCarta.append(carta);

    //Agregar algunos eventos
    
    botonAgregar.onclick = () => {
        //alert("Hiciste click en el botón del producto:" + producto.id);

        let elementoExistente = 
            elementosCarrito.find((elem) => elem.producto.id == producto.id);
        
        if(elementoExistente) {
            elementoExistente.cantidad+=1;
        } else {
            let elementoCarrito = new ElementoCarrito(producto, 1);
            elementosCarrito.push(elementoCarrito);
        }


        dibujarCarrito();

        swal({
            title: '¡Producto agregado!',
            text: `${producto.nombre} agregado al carrito`,
            icon: 'success',
            buttons: {
                cerrar: {
                    text: "cerrar",
                    value: false
                },
                carrito: {
                    text: "ir a carrito",
                    value: true
                }
            }
        }).then((decision) => {
            if(decision) {
                const myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {keyboard: true});
                const modalToggle = document.getElementById('toggleMyModal'); 
                myModal.show(modalToggle);
            }
            guardarCarritoEnLocalStorage();
        });

    }
    return carta;
}

function dibujarCatalogoProductos() {
    contenedorProductos.innerHTML = "";

    productos.forEach(
        (producto) => {
            let contenedorCarta = crearCard(producto);
            contenedorProductos.append(contenedorCarta);
        }
    );
}

function salir() {
    elementosCarrito.length === 0 && swal('Con tela joyeria \n\nGracias Por tu Visita. Te Esperamos Pronto!') ||
    swal('Con tela joyeria\n\nPuedes retirar tu pedido en despacho. Gracias!');
    vaciarCarrito();
}

//AL HACER CLICK AL BOTON RESETEO EL CARRITO EN 0 Y LO ACTUALIZO

botonVaciar.addEventListener("click", () => {
    vaciarCarrito();
});

let comprafinalizada = document.getElementById(`comprafinalizada`);
    comprafinalizada.addEventListener('click', () => {
         salir();
});

// HAGO UN STRINGIFY DE CARRITO  Y SE GUARDA EN LA KEY CARRITO

function guardarCarritoEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(elementosCarrito));
}

function cargarCarritoDeLocalStorage() {
        carrito = JSON.parse(localStorage.getItem("elementosCarrito")) || [] ;
        actualizarCarrito();
}


