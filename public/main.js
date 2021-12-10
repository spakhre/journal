let editButton = document.getElementsByClassName('editButton');

Array.from(editButton).forEach((element) => 

    element.addEventListener('click', (element) => editEntry(element))
)

function editEntry(e) {
    console.log(e.target)
    
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
