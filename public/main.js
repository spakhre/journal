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