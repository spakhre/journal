const URL = "http://localhost:3000"

let editButton = document.getElementsByClassName('editButton');

Array.from(editButton).forEach((element) => 

    element.addEventListener('click', (element) => editEntry(element))
)

async function editEntry(e) {
    let button = e.target

    let userId = button.getAttribute("user-id")
    let entryId = button.getAttribute("entry-id")
    let title = button.closest('.card-body').querySelector('.card-title').innerText
    let note = button.closest('.card-body').querySelector('.note').innerText
    let tag =  button.closest('.card-body').querySelector('.tag').innerText
    

    let idInfo = {
        userId,
        entryId,
        title,
        note, 
        tag
    }
   

    await fetch("/allEntries", {
        method: "PUT",
        body: JSON.stringify(idInfo),
        headers: {
            "Content-Type" : "application/json"
        }
    })
    .then(response => {
        if (response.ok) return response.json()
      })
    .then( data =>
            window.location.reload()
        )
    
}

let deleteButton = document.getElementsByClassName('deleteButton');

Array.from(deleteButton).forEach( function(element){
    element.addEventListener('click', function(event){
        const entryId = event.target.getAttribute('entry-id');
        const userId = event.target.getAttribute('user-id');

        fetch(`allEntries`,{
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "userId": userId,
                "entryId": entryId
            })
        })
        .then((res) => {
            window.location.reload()
        })
    })
    })
