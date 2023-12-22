// define global variables to track currently displayed image
var selectedImageIndex;

function uploadImage() {
    var formData = new FormData(document.getElementById('uploadForm'));
    fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            getImageGallery();
        } else {
            alert('Image Upload Fail');
        }
    })
    .catch(error => console.error('Error:', error));
}

function getImageGallery() {
    fetch('http://localhost:3000/gallery')
        .then(response => response.json())
        .then(data => {
            let gallery = document.getElementById('gallery');
            gallery.innerHTML = '';
            data.forEach((img, index) => {
                let imageElement = document.createElement('div');
                imageElement.classList.add('w-32', 'h-32', 'relative', 'bg-center', 'bg-cover', 'rounded-md', 'border', 'border-white');
                imageElement.setAttribute('style', `background-image: url('${img.url}')`);
                imageElement.setAttribute('onclick', `showModal(${index}, '${img.url}')`);
                gallery.appendChild(imageElement);
            });
        });
}

function deleteImage(index) {
    fetch(`http://localhost:3000/delete/${index}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                getImageGallery();
                hideModal();
            }
        });
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    alert('Copied to clipboard');
}

function showModal(index, url) {
    document.getElementById('modalImage').src = url;
    document.getElementById('modal').classList.remove('hidden');
    selectedImageIndex = index;
}

function hideModal() {
    document.getElementById('modal').classList.add('hidden');
}

getImageGallery();
