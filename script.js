const uploadBox = document.querySelector(".upload-box"),
previewImg = uploadBox.querySelector("img"),
fileInput = uploadBox.querySelector("input"),
widthInput = document.querySelector(".width input"),
heightInput = document.querySelector(".height input"),
ratioInput = document.querySelector(".ratio input"),
qualityInput = document.querySelector(".quality input"),
downloadBtn = document.querySelector(".download-btn"),
wrapper =document.querySelector('.wrapper');

let file;
let wantedType;

widthInput.addEventListener('keyup',() => {
    const height = ratioInput.checked ? widthInput.value / ogImageRatio : heightInput.value;
    heightInput.value =Math.floor(height);
});

heightInput.addEventListener('keyup',() => {
    const width = ratioInput.checked ? heightInput.value * ogImageRatio : widthInput.value;
    widthInput.value =Math.floor(width);
});

downloadBtn.addEventListener('click',resizeAndDownload);

fileInput.addEventListener('change',loadFile)

uploadBox.addEventListener('click',() => {
    fileInput.click();
});

uploadBox.addEventListener('dragover', e => {
    e.preventDefault();
    uploadBox.classList.add('active');
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('active');
});

uploadBox.addEventListener('drop', e => {
    e.preventDefault();
    file = e.dataTransfer.files[0];
    if(!file){
        wrapper.classList.add('error');
    }
    wantedType=file.type;
    showFile();
});

function showFile(){
    let validExtensions = ["image/jpeg", "image/jpg", "image/png"];
    if(validExtensions.includes(wantedType)){
        previewImg.src = URL.createObjectURL(file);
        previewImg.addEventListener('load',() => {
            if(previewImg.src.split("/")[3] !== 'upload-icon.svg'){
                widthInput.value = previewImg.naturalWidth;
                heightInput.value = previewImg.naturalHeight;
                ogImageRatio = previewImg.naturalWidth / previewImg.naturalHeight;
                wrapper.classList.remove('error');
                wrapper.classList.add('active');
            }
        });
    }else{
        wrapper.classList.remove('active');
        wrapper.classList.add('error');
        previewImg.src = 'upload-icon.svg';
    }
}

function loadFile(e){
    file = e.target.files[0];
    if(!file){
        wrapper.classList.add('error');
    }
    wantedType=file.type;
    showFile();
}

function resizeAndDownload(){
    const canvas = document.createElement('canvas');
    const a = document.createElement('a');
    const ctx = canvas.getContext('2d');

    const imgQuality = qualityInput.checked ? 0.7 : 1.0;

    canvas.width = widthInput.value;
    canvas.height = heightInput.value;

    ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);
    a.href= canvas.toDataURL(wantedType,imgQuality);
    a.download = new Date().getTime();
    a.click()
}