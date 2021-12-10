let editButton = document.getElementsByClassName('editButton');

Array.from(editButton).forEach((element) => 

    element.addEventListener('click', (element) => editEntry(element))
)

function editEntry(e) {
    console.log(e.target)
    
}