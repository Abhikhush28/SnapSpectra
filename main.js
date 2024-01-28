const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".ri-close-line");
const downloadimgBtn = lightBox.querySelector(".ri-download-2-line");




// API Key , paginations , searchTerm Variables
const apikey ="CzGAE8lbc6MvXftcdYRjS69Fkp4EKZCbEFUAxAq5wdbAuClN1fkqHFUL";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgurl) =>{

    // converting  recived  img  to blob , creating  its  download link ,  &  downloading it
    fetch(imgurl).then(res => res.blob()).then(file =>{
       const a = document.createElement("a");
       a.href = URL.createObjectURL(file);
       a.download = new Date().getTime();
       a.click();
    }).catch(err => alert("Failed to download Image!"));
}


const showLightBox = (img, name) =>{
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerHTML = name;
    downloadimgBtn.setAttribute("data-img", img);
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";
}

const hideLightBox = () =>{
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}   



const generateHTML = (images) =>{

    // Making  li  of all fetched images  and adding them  to the  existing  image wrapper
   imagesWrapper.innerHTML += images.map(img =>
        `<li class="card" onclick = "showLightBox('${img.src.large2x}','${img.photographer}')">
            <img src="${img.src.large2x}" alt="img">
                <div class="details">
                    <div class="photographer">
                        <i class="ri-camera-line"></i>
                        <span>${img.photographer}</span>
                    </div>
                    <button onclick ="downloadImg('${img.src.original}')">
                        <i class="ri-download-2-line"></i>
                    </button>
                </div>
        </li>`
        
    ).join("")
   
}

const getImages = (apiUrl) =>{

    //fetching Image by APi Call with  authorization header
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled")
    fetch(apiUrl,{
        headers: { Authorization: apikey }
    }).then(res => res.json()).then(data => {
        // console.log(generateHTML(data.photos));
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");
    }).catch(err => alert('Failed to load Images!'))
}

const loadMoreImages = () =>{
    currentPage++;
    let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    let apiUrl2 = `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`;

    if(loadSearchImages){
        getImages(apiUrl2);
    }
    else{
        getImages(apiUrl); 
    }
    
}

const loadSearchImages = (e) =>{
    // iF The Search input is empty, set  the search term  to null and return  from here
    if(e.target.value === "") return searchTerm = null;

    // If pressed key is Enter, update the current page, search term & call the getImages
    if(e.key === "Enter"){
        currentPage =1
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`)
    }

}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

loadMoreBtn.addEventListener('click', loadMoreImages);
searchInput.addEventListener('keyup', loadSearchImages);
closeBtn.addEventListener('click', hideLightBox);
downloadimgBtn.addEventListener('click', (e) => downloadImg(e.target.dataset.img));