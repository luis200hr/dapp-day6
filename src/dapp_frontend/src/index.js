import { canisterId, createActor } from "../../declarations/dapp_backend";
import { HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
const formUpdate = document.getElementById("actualizar");

let dapp_backend;
let authClient = await AuthClient.create();
/*try{
  let identity = authClient.getIdentity();
    dapp_backend = createActor(canisterId, {agent: new HttpAgent({identity})});
}catch{
  console.log("no se pudo");
}*/
const BtnLog = document.getElementById("sesion");
if (await authClient.isAuthenticated()) {
  handleAuthenticated(authClient);
  BtnLog.value = "Logout";
}
async function handleAuthenticated(authClient) {
  let identity = authClient.getIdentity();
  dapp_backend = createActor(canisterId, {agent: new HttpAgent({identity})});
}

BtnLog.onclick =  async () => {
    if(await authClient.isAuthenticated()){
      authClient.logout();
      BtnLog.value = "Login";
      alert("Session closed");
      return;
    }
    authUrl = await authClient.login({
    onSuccess: async () => {
      alert("logeado");
      BtnLog.value = "Logout";
      handleAuthenticated(authClient);
      //let identity = authClient.getIdentity();
      //dapp_backend = createActor(canisterId, {agent: new HttpAgent({identity})});
    },
    onError: async () =>{
      alert("error logging");
    },
    windowOpenerFeatures: "width=500,height=500,toolbar=0,location=0,menubar=0,left=100,top=100"
  });
  window.open(authUrl, "loginPopup", "width=500,height=600");
};
const formulario = document.getElementById("myForm");
document.querySelector("form").addEventListener("submit", async function(event){
  event.preventDefault();
  let usuarioOn = await authClient.isAuthenticated()
  if (!usuarioOn) {
    alert("user not authenticated");
    return;
  }

  
  const button = event.target.querySelector("#submit-btn");

  const name = document.getElementById("name").value;
  const desp = document.getElementById("desp").value;
  const date = document.getElementById("fecha").value;
  var checkbox = document.getElementById("state");
  const estado = checkbox.checked;
  console.log(estado);
  const tarea = { title: name, description: desp, dueDate: date, completed: estado };

  button.setAttribute("disabled", true);
  await dapp_backend.addHomework(tarea);
  console.log("se agrego tarea");
  formulario.reset();
  button.removeAttribute("disabled");
})

// Obtén una referencia al botón
const btn = document.getElementById("submit-btn2");
//const button2 = document.getElementById("submit-btn2");
// Agrega un evento de escucha al botón
btn.addEventListener("click", async () => {
  formUpdate.classList.remove("relative");
  //button2.setAttribute("disabled", true);
  formUpdate.classList.toggle("relative");
  const homeworkList = await dapp_backend.getAllHomework();
  const container = document.getElementById("container");

  // Limpiar el contenido existente en el contenedor
  container.innerHTML = "";
// Recorre cada objeto en el array `homeworkList`
homeworkList.forEach(homework => {
  // Crea un nuevo <textarea> para cada objeto
  const textarea = document.createElement("textarea");
  // Establece el contenido del <textarea>
  textarea.value = `Title: ${homework.title}\nCompleted: ${homework.completed}\nDate: ${homework.dueDate}\nDescription: ${homework.description}`;
  // Asigna la clase CSS al <textarea>
  textarea.classList.add("card");
  // Agrega el <textarea> al contenedor
  textarea.setAttribute("readonly", true);
  textarea.setAttribute("disabled", true);
  container.appendChild(textarea);
});
//button2.removeAttribute("disabled");

});

//Control de tareas por ID
// Obtener referencias a los elementos HTML
const borrarBtn = document.getElementById("borrar");
const completadoBtn = document.getElementById("completado");
const obtenerBtn = document.getElementById("obtener");
const searchInput = document.getElementById("searchById");
const searchInput2 = document.getElementById("clave");
searchInput.addEventListener("input", () => {
  searchInput.value = searchInput.value.replace(/\D/g, ""); 
});
searchInput2.addEventListener("input", () => {
  searchInput2.value = searchInput2.value.replace(/\D/g, ""); 
});
// Agregar evento de clic al botón Borrar
borrarBtn.addEventListener("click", async () => {
  
  const button4 = document.getElementById("borrar");
  const inputValue = searchInput.value;
  const id = parseInt(inputValue, 10);
  button4.setAttribute("disabled", true);
  container.innerHTML = "";
  const textarea = document.createElement("textarea");
  try {
    await dapp_backend.deleteHomework(id);
  } catch (error) {
    console.log("entro en el catch");
    textarea.value="Error";
    textarea.classList.add("card");
    textarea.setAttribute("readonly", true);
    textarea.setAttribute("disabled", true);
    container.appendChild(textarea); 
  }
  document.getElementById("searchById").value="";
  button4.removeAttribute("disabled");

});

// Agregar evento de clic al botón Completado
completadoBtn.addEventListener("click", async () => {
  const button3 = document.getElementById("completado");
  const inputValue = searchInput.value;
  const id = parseInt(inputValue, 10);
  const textarea = document.createElement("textarea");
  //container.innerHTML = "";
  button3.setAttribute("disabled", true);
  try{
    await dapp_backend.markAsCompleted(id);
  }catch(error){
    console.log("entro en el catch de completed");
    container.innerHTML = "";
    textarea.value = error.toString();
    textarea.classList.add("card");
    textarea.setAttribute("readonly", true);
    textarea.setAttribute("disabled", true);
    container.appendChild(textarea); 
  }
  button3.removeAttribute("disabled");
  
 
});

// Agregar evento de clic al botón Obtener
obtenerBtn.addEventListener("click", async () => {
  formUpdate.classList.remove("relative");
  const inputValue = searchInput.value;
  const id = parseInt(inputValue, 10);
  container.innerHTML = "";
  const textarea = document.createElement("textarea");
  try{
    const homeworkList2 = await dapp_backend.getHomework(id);
    document.getElementById("searchById").value="";
    const homework = homeworkList2.ok; 
    const homeworkText = `Title: ${homework.title}\nCompleted: ${homework.completed}\nDate: ${homework.dueDate}\nDescription: ${homework.description}`;

    textarea.value = homeworkText;
  }catch{
    textarea.value = "There is no homework with that id";
  }
  textarea.classList.add("card");
  textarea.setAttribute("readonly", true);
  textarea.setAttribute("disabled", true);
  container.appendChild(textarea); 
});
//busqueda por termino
const busquedaBtn = document.getElementById("busqueda");
busquedaBtn.addEventListener("click", async () => {
  formUpdate.classList.remove("relative");
  container.innerHTML = "";
  const searchInput = document.getElementById("search");
  const searchTerm = searchInput.value;

  // Ejecutar la función de búsqueda
  const result = await dapp_backend.searchHomework(searchTerm);
  document.getElementById("search").value="";
  const textarea = document.createElement("textarea");

  if (result.length === 0 ) {
     // Otros casos no esperados
     textarea.value = "homework not found";
  } else {
   // Acciones si la búsqueda es exitosa
   let homeworkText = '';
   result.forEach((homework, index) => {
   homeworkText += `Title: ${homework.title}\n`;
   homeworkText += `Completed: ${homework.completed}\n`;
   homeworkText += `Date: ${homework.dueDate}\n`;
   homeworkText += `Description: ${homework.description}`;
 
   if (index !== result.length - 1) {
     homeworkText += ',\n\n'; // Agrega una separación entre los objetos
   }
  });
 textarea.value = homeworkText;
  }

  textarea.classList.add("card");
  textarea.setAttribute("readonly", true);
  textarea.setAttribute("disabled", true);
  container.appendChild(textarea);

});

//Busqueda de tareas pendientes
const BtnPending = document.getElementById("taskpendig");
BtnPending.addEventListener("click", async () => {
  formUpdate.classList.remove("relative");
  container.innerHTML = "";
  const textarea = document.createElement("textarea");
  const homeworkList2 = await dapp_backend.getPendingHomework();
  if(homeworkList2.length === 0){
    textarea.value = "No pending Homework";
  }else{
      homeworkList2.forEach(homework => {
      // Crea un nuevo <textarea> para cada objeto
      const textarea = document.createElement("textarea");
      // Establece el contenido del <textarea>
      textarea.value = `Title: ${homework.title}\nCompleted: ${homework.completed}\nDate: ${homework.dueDate}\nDescription: ${homework.description}`;
      // Asigna la clase CSS al <textarea>
      textarea.classList.add("card");
      // Agrega el <textarea> al contenedor
      textarea.setAttribute("readonly", true);
      textarea.setAttribute("disabled", true);
      container.appendChild(textarea);
    });
  }  
}); 

//Actualizar tarea
const formulario2 = document.getElementById("myForm2");
document.querySelector('form[id="myForm2"]').addEventListener("submit", async function(event){
  event.preventDefault();
  const button = event.target.querySelector("#upda");
  const upId = document.getElementById("clave").value;
  const idUp = parseInt(upId, 10);
  const name2 = document.getElementById("name2").value;
  const desp2 = document.getElementById("desp2").value;
  const date2 = document.getElementById("fecha2").value;
  var checkbox = document.getElementById("state2");
  const estado2 = checkbox.checked;
  console.log(estado2);
  const tarea2 = { title: name2, description: desp2, dueDate: date2, completed: estado2 };

  button.setAttribute("disabled", true);
  await dapp_backend.updateHomework(idUp, tarea2);
  console.log("se actualizo tarea");
  formulario2.reset();
  button.removeAttribute("disabled");
})

