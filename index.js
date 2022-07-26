const drop = document.querySelector(".drop");
const fileInput = document.querySelector(".fileInput")
const btn = document.querySelector(".btn")
const progressBar = document.querySelector(".progressBar")
const progress = document.querySelector(".progress")
const percentId = document.querySelector("#percent")
const fileURL = document.querySelector("#fileURL")
const sharing = document.querySelector(".sharing")
const copyBtn = document.querySelector("#copyBtn")
const qrcode = document.querySelector("#qr-code")
const qrContainer = document.querySelector(".qr-container")
const toast = document.querySelector(".toast")

const qrURL = "https://api.qrserver.com/v1/create-qr-code/?size=100x100&bgcolor=232533&color=fafafa&data=";
const host = "https://qshare-server.herokuapp.com/"
const uploadURL = `${host}api/files`

const maxSize = 10 * 1024 * 1024 ;

drop.addEventListener("dragover", (e) => {
    e.preventDefault()

    if (!drop.classList.contains("dragged")){
        drop.classList.add("dragged");
    }
});

drop.addEventListener("dragleave", () => {
    drop.classList.remove("dragged");
});

drop.addEventListener("drop", (e) => {
    e.preventDefault()
    drop.classList.remove("dragged");
    const files = e.dataTransfer.files;
    //console.table(files);
    if(files.length){
        fileInput.files = files;
        uploadFile();
    }
});

fileInput.addEventListener("change", ()=>{
    uploadFile();
})

btn.addEventListener("click", ()=>{
    fileInput.click()
})

const uploadFile =  () => {
    if (fileInput.files.length > 1){
        fileInput.value = "";
        showToast("upload only 1 file.");
        return; 
    }
    const file = fileInput.files[0];
    if (file.size > maxSize){
        fileInput.value = "";
        showToast("Can;t upload more than 10mb")
        return ;
    }
    progressBar.style.display = "block";
    const formData = new FormData();
    formData.append("Myfile",file)
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if(xhr.readyState ===  XMLHttpRequest.DONE){
            //console.log(xhr.response);
            showLink(JSON.parse(xhr.response));
        }
    }
    xhr.upload.onprogress = Updateprogress; 

    xhr.upload.onerror = () =>{
        fileInput.value = "";
        showToast(`Error in upload: ${xhr.statusText}`);
    }

    xhr.open("POST", uploadURL);
    xhr.send(formData);
};

const Updateprogress = (e) => {
    const percent = Math.round((e.loaded / e.total) * 100);
    //console.log(percent);
    progress.style.width = `${percent}%`;
    percentId.innerText = percent;
}

const showLink = ({file: url}) => {
    console.log(url);
    progressBar.style.display = "none";
    sharing.style.display = "block"
    qrContainer.style.display = "block"
    fileURL.value = url;
    qrcode.setAttribute("src", qrURL + url);
    showToast("file uploaded!");
}

copyBtn.addEventListener("click", () =>{
    fileURL.select();
    document.execCommand("copy");
    showToast("Copied to clipboard!")
})

let toastTimer;
const showToast = (msg) => {
    toast.innerText = msg;
    toast.style.transform = "translate(-50%, 0)";
    clearTimeout(toastTimer);
    toastTimer = setTimeout( () => {
    toast.style.transform = "translate(-50%, 60px)";
    }, 2000)
}