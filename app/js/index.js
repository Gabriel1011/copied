const { ipcRenderer, clipboard } = require('electron');
const clipboardWatcher = require('electron-clipboard-watcher')

let copies = [];
let primeiroTexto = "";
criarLista ();

clipboardWatcher({
  // (optional) delay in ms between polls
  watchDelay: 1,

  // handler for when image data is copied into the clipboard
  onImageChange: function (nativeImage) { console.log('Pega Imagem');  },
  // handler for when text data is copied into the clipboard
  onTextChange: function (text) {
    console.log(text);
    copies.push(text);
    criarItem(text);
    topoTela();
  }
})

function criarLista () {
  var copies = getAllJsonStorage();
  let elemento = document.createElement("li");

  elemento.children = null;

  copies.forEach(element => {
    renderItem(element);
  });
}

function renderItem(item){
  let elemento = document.createElement("li");
  let node = document.createTextNode(item.texto);
  elemento.appendChild(node);
  elemento.id = item.id;

  elemento.addEventListener('dblclick', () => { console.log("Deletou!"); });

  ["list-group-item", "list-item"].forEach(element => { elemento.classList.add(element); });

  elemento.addEventListener("click", () => { enviarItemParaClipBoard(item); })

  var lista = document.getElementById("copies");
  lista.insertBefore(elemento, lista.firstChild);
}

function criarItem(texto){
    primeiroTexto = texto;
    item = { id: uuidv4(), texto: texto, dataCriacao: Date.now() };

    addJsonStorage(item);
    renderItem(item);
}

function filtrarItens(texto){
  var input, filter, ul, li, txtValue;
  input = document.getElementById('pesquisa');
  filter = input.value.toUpperCase();

  ul = document.getElementById("copies");
  li = ul.getElementsByClassName('list-item');

  [...li].map((l)=>{
    txtValue = l.textContent || l.innerText;

    if(txtValue.toUpperCase().indexOf(filter) > -1){
      l.style.display = "";
      l.innerHTML = txtValue.toUpperCase().replace(filter, '<span class="text-find">' + filter + '</span>' ).toLowerCase();
    }else{
      l.style.display = "none";
    }
  });
}

function deletarItem(item) {
  ul = document.querySelector('ul');
  li = ul.getElementsByClassName('list-item');

  [...li].map((l) => {
    if(l.id == item.id){
      ul.removeChild(l);
      deleteJsonStorage(item);
    }
  });
}

function esconderTela(){
  ipcRenderer.send('esconde-tela');
}

function enviarItemParaClipBoard(item){
  if(primeiroTexto != item.texto) deletarItem(item);
  clipboard.writeText(item.texto);
  esconderTela();
  limparCampoPesquisa();
}

function topoTela() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function limparCampoPesquisa(){
  campoPesquisa = document.getElementById('pesquisa');
  campoPesquisa.value = "";
  filtrarItens();
}

ipcRenderer.on('lipar-campo-pesquisa', ()=>{
  limparCampoPesquisa();
  topoTela();
})