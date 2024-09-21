

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
    let url = 'http://127.0.0.1:5000/beers';
    fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => {
        data.beers.forEach(item => insertList(formatDate(item.date), item.name, item.type, item.ibu, item.value, item.note))
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
 
  const formatDate = (date) => {
    newDate = new Date(date).toLocaleDateString();
    return newDate
    
  }
  
  /*
    --------------------------------------------------------------------------------------
    Chamada da função para carregamento inicial dos dados
    --------------------------------------------------------------------------------------
  */
  getList()
 
 
  /*
    --------------------------------------------------------------------------------------
    Função para colocar um item na lista do servidor via requisição POST
    --------------------------------------------------------------------------------------
  */
  const postItem = async (inputBeer, inputType, inputIbu, inputValue, inputNote) => {
      const formData = new FormData();
      formData.append('name', inputBeer);
      formData.append('type', inputType);
      formData.append('ibu', inputIbu);
      formData.append('value', inputValue);
      formData.append('note', inputNote);
   
      let url = 'http://127.0.0.1:5000/beer';
      return fetch(url, {
        method: 'post',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Erro desconhecido');
            });
        } 
        return response.json();
      });
    }
   
 
  /*
    --------------------------------------------------------------------------------------
    Função para remover um item da lista de acordo com o click no botão deletar
    --------------------------------------------------------------------------------------
  */
  const removeElement = () => {
    let close = document.getElementsByClassName("close");
   
    let i;
    for (i = 0; i < close.length; i++) {
      close[i].onclick = function () {
        let div = this.parentElement.parentElement;
        const nameItem = div.getElementsByTagName('td')[1].innerHTML
        if (confirm("Você tem certeza que deseja excluir a cerveja?")) {
          div.remove()
          deleteItem(nameItem)
          alert("Removido!")
        }
      }
    }
  }
 
  /*
    --------------------------------------------------------------------------------------
    Função para deletar um item da lista do servidor via requisição DELETE
    --------------------------------------------------------------------------------------
  */
  const deleteItem = (item) => {    
    let url = 'http://127.0.0.1:5000/beer?name=' + item;
    fetch(url, {
      method: 'delete'
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
  }
 
 
    /*
    --------------------------------------------------------------------------------------
    Função para adicionar uma nova cerveja
    --------------------------------------------------------------------------------------
  */
  const newItem = () => {
    let inputBeer= document.getElementById("newBeer").value;
    let inputType = document.getElementById("typeBeer").value;
    let inputIbu = document.getElementById("ibuBeer").value;
    let inputValue = document.getElementById("priceBeer").value;
    let inputNote = document.getElementById("noteBeer").value;

    let today = new Date().toLocaleDateString();
 
    if (inputBeer === '' || inputNote =='') {
      alert("Cerveja e nota são obrigatórios!");
    }
    else if (isNaN(inputIbu) || isNaN(inputValue) || isNaN(inputNote)) {
     alert("IBU, valor e nota precisam ser números!");
    }
    else {
      postItem(inputBeer, inputType, inputIbu, inputValue, inputNote)
          .then(() => {
              insertList(today, inputBeer, inputType, inputIbu, inputValue, inputNote)
              alert("Cerveja adicionada!");
          })
          .catch(error => {
            
              console.error('Erro ao adicionar cerveja:', error);
              alert(`Erro ao adicionar cerveja: ${error.message}`);
          });  
    }
  }
 
  /*
    --------------------------------------------------------------------------------------
    Função para mostrar em tela cerevejas na lista apresentada
    --------------------------------------------------------------------------------------
  */
  const insertList = (date, beer, type, ibu, value, note) => {
    var item = [date, beer, type, ibu, value, note]
    var table = document.getElementById('table-body');
    var row = table.insertRow();

    item.forEach((value, index) => {
      var cel = row.insertCell(index);
      cel.textContent = value; 
    });
   
    insertButton(row.insertCell(-1))
    document.getElementById("newBeer").value = "";
    document.getElementById("typeBeer").value = "";
    document.getElementById("ibuBeer").value = "";
    document.getElementById("priceBeer").value = "";
    document.getElementById("noteBeer").value = "";
    
    sortTableByNote()
    removeElement()
  }
 
  /*
    --------------------------------------------------------------------------------------
    Função para criar um botão deletar para cada cerveja da lista
    --------------------------------------------------------------------------------------
  */
  const insertButton = (parent) => {
    let span = document.createElement("span");
    let txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.id = "close"
    span.appendChild(txt);
    parent.appendChild(span);
  }

  /*
    --------------------------------------------------------------------------------------
    Função para ordenar a lista de cerveja
    --------------------------------------------------------------------------------------
  */
  
  const sortTableByNote = () => {
    var table = document.getElementById('table-body');
    var rows = Array.from(table.rows);
   
    rows.sort((a, b) => {
        const noteA = parseFloat(a.cells[5].textContent) || 0;
        const noteB = parseFloat(b.cells[5].textContent) || 0;
        return noteB - noteA; 
    });

    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }    
  
    rows.forEach(row => table.appendChild(row));
  }