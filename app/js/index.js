const { ipcRenderer, clipboard } = require('electron');
const clipboardWatcher = require('electron-clipboard-watcher')

let copies = [];
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

  elemento.addEventListener("click", () => { enviarItemParaClipBoard(item.texto); })

  var lista = document.getElementById("copies");
  lista.insertBefore(elemento, lista.firstChild);
}

function criarItem(item){
    item = { id: uuidv4(), texto: item, dataCriacao: Date.now() };

    addJsonStorage(item);
    renderItem(item);
}

function filtrarItens(texto){
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('pesquisa');
  filter = input.value.toUpperCase();

  ul = document.getElementById("copies");
  li = ul.getElementsByClassName('list-item');

  for (let i = 0; i < li.length; i++) {
    txtValue = li[i].textContent || li[i].innerText;
    txtValue.toUpperCase().indexOf(filter) > -1 ?
    li[i].style.display = "" :
    li[i].style.display = "none" ;
  }
}

function deletarItem(item) {
  ul = document.getElementById("copies");
  li = ul.getElementsByClassName('list-item');

  for (let i = 0; i < li.length; i++) {
    txtValue = li[i].textContent || li[i].innerText;

    if(txtValue.toUpperCase() == item.texto)
      li[i].innerText = "";
  }
}

function esconderTela(){
  ipcRenderer.send('esconde-tela');
}

function enviarItemParaClipBoard(texto){
  clipboard.writeText(texto);
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