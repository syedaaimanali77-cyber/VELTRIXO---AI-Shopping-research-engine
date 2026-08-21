const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {

    const query = document.getElementById("searchInput").value.trim();

    if(query===""){

        alert("Please enter a product.");

        return;

    }

    window.location.href=`results.html?q=${encodeURIComponent(query)}`;

});

document.getElementById("searchInput").addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        searchBtn.click();

    }

});