const inputEl=document.querySelector("input")
const searchBtnEl=document.querySelector("button.search")
let movieEl=document.querySelector("div.movies")
const moreBtnEl=document.querySelector("button.more")
const page=1

import axios from "axios"
function getMovies(movie,page=1,year=null,type="movie"){
    axios
    .get(`https://www.omdbapi.com/?apikey=7035c60c&s=${movie}&page=${page}&y=${year}&type=${type}`)
    .then((response)=>{
        console.log(response)

        for(let movieel of response.data.Search){
            console.log(movieel)
            
            const el=document.createElement("div")
            el.classList.add("movie")
            const titleEl=document.createElement("h2")
            titleEl.classList.add("title")
            titleEl.textContent=movieel.Title
            const imgEl=document.createElement("img")
            imgEl.classList.add("movie-poster")
            imgEl.src=movieel.Poster
            const yearEl=document.createElement("div")
            yearEl.classList.add("year")
            yearEl.textContent=movieel.Year
            movieEl.append(el)
            el.append(titleEl,imgEl,yearEl)
            
            el.addEventListener("click",()=>{
                console.log(movieel.Title)
                console.log(movieel.imdbID)
                
                let movieInfo=document.createElement("div")
                movieInfo.classList.add("modal")
                const body=document.querySelector("body")
                body.append(movieInfo)
                let modalFlex=document.createElement("div")
                modalFlex.classList.add("modal-flex")
                movieInfo.append(modalFlex)
                
                function getMovieInfo(id){
                    axios
                    .get(`https://www.omdbapi.com/?apikey=7035c60c&i=${id}&plot=full`)
                    .then((response)=>{
                        console.log(response)

                        const tiEl=document.createElement("div")
                        tiEl.textContent=response.data.Title
                        tiEl.classList.add("movie-title")
                        const photoEl=document.createElement("img")
                        photoEl.src=response.data.Poster
                        photoEl.classList.add("movie-photo")
                        const dateEl=document.createElement("div")
                        dateEl.classList.add("movie-date")
                        dateEl.textContent=response.data.Released
                        const timeEl=document.createElement("div")
                        timeEl.classList.add("movie-time")
                        timeEl.textContent=response.data.Runtime
                        const plotEl=document.createElement("div")
                        plotEl.classList.add("movie-plot")
                        plotEl.textContent=response.data.Plot
                        
                        // const ratesEl=document.createElement("div")
                        // ratesEl.classList.add("rates")
                        // const rating=document.createElement("h3")
                        // rating.append("Rating")
                        // ratesEl.append(rating)
                        // for(let i=0;i<(response.data.Ratings.length);i+=1){
                        //     let rateEl=document.createElement("div")
                        //     let rateElclass=response.data.Ratings[i].Source
                        //     console.log(rateElclass)
                        //     rateEl.textContent=response.data.Ratings[i].value
                        //     rateEl.classList.add(`${rateElclass}`)
                        //     let rateIEl=document.createElement("div")
                        //     rateIEl.classList.add(`${rateElclass}`)
                        //     rateIEl.classList.add("backgroundImage")
                        //     ratesEl.append(rateEl,rateIEl)
                        // }
                        
                        const actorsEl=document.createElement("div")
                        actorsEl.textContent=response.data.Actors
                        actorsEl.classList.add("movie-actor")
                        const directorEl=document.createElement("div")
                        directorEl.textContent=response.data.Director
                        directorEl.classList.add("movie-director")
                        const productionEl=document.createElement("div")
                        productionEl.textContent=response.data.Production
                        productionEl.classList.add("movie-production")
                        const genreEl=document.createElement("div")
                        genreEl.textContent=response.data.Genre
                        genreEl.classList.add("movie-genre")
                        const closeEl=document.createElement("div")
                        closeEl.classList.add("material-symbols-outlined")
                        closeEl.textContent="close"

                        modalFlex.append(tiEl,photoEl,dateEl,timeEl,plotEl,actorsEl,directorEl,productionEl,genreEl,closeEl)
                        // movieInfo.append(ratesEl)
                        const actortitleEl=document.createElement("h3")
                        actortitleEl.append("Actors")
                        actorsEl.append(actortitleEl)
                        const directorTitleEl=document.createElement("h3")
                        directorTitleEl.append("Director")
                        directorEl.append(directorTitleEl)
                        const productionTitleEl=document.createElement("h3")
                        productionTitleEl.append("Production")
                        productionEl.append(productionTitleEl)
                        const genreTitleEl=document.createElement("h3")
                        genreTitleEl.append("genre")
                        genreEl.append(genreTitleEl)
                        modal()
                    })
                }
                let key=movieel.imdbID
                getMovieInfo(`${key}`)
            })            
        }
        return response
    })
}

getMovies("`${movie}`",1,2014,"`${type}`")

function removeMoreBtn(movie,page,year,type){
    axios
    .get(`https://www.omdbapi.com/?apikey=7035c60c&s=${movie}&page=${page}&y=${year}&type=${type}`)
    .then((response)=>{
        console.log(response)
        console.log(response.data.totalResults)
        let remove=response.data.totalResults
        if(document.querySelectorAll("div.movie").length>=Number(remove)){
            console.log("ladybug")
            moreBtnEl.style.display="none"
        }
        else{moreBtnEl.style.display="block"}
    })
}
removeMoreBtn("`${movie}`",`${page}`,2014,"`${type}`")

searchBtnEl.addEventListener("click",()=>{
    let el=document.querySelectorAll("div.movie")
    for(let i=0; i<=el.length-1;i+=1){
        console.log(i)
        el[i].parentNode.removeChild(el[i])
    }
    moreBtnEl.style.display="block"
    let typeEls=document.getElementById("type")
    let type=typeEls.value
    console.log(type)
    let yearEls=document.getElementById("year")
    let year=yearEls.value
    console.log(year)
    let movie=inputEl.value
    console.log(movie)
    getMovies(`"${movie}"`,1,`${year}`,`"${type}"`)
    removeMoreBtn(`"${movie}"`,1,`${year}`,`"${type}"`)
    getId(`"${movie}"`,1,`${year}`,`"${type}"`)
})
inputEl.addEventListener("keypress",function(key){
    if(key.key==="Enter"){
        let movie=inputEl.value
        console.log(movie)
        let el=document.querySelectorAll("div.movie")
        for(let i=0; i<=el.length-1;i+=1){
            console.log(i)
            el[i].parentNode.removeChild(el[i])
        }
        moreBtnEl.style.display="block"
        let typeEls=document.getElementById("type")
        let type=typeEls.value
        console.log(type)
        let yearEls=document.getElementById("year")
        let year=yearEls.value
        console.log(year)
        removeMoreBtn(`"${movie}"`,1,`${year}`,`"${type}"`)
        getMovies(`"${movie}"`,1,`${year}`,`"${type}"`)
        getId(`"${movie}"`,1,`${year}`,`"${type}"`)
    }
})

moreBtnEl.addEventListener("click",()=>{
    let typeEls=document.getElementById("type")
    let type=typeEls.value
    console.log(type)
    let yearEls=document.getElementById("year")
    let year=yearEls.value
    console.log(year)
    let movie=inputEl.value
    console.log(movie)
    let page=1
    page+=1
    getMovies(`"${movie}"`,`${page}`,`${year}`,`"${type}"`)
    removeMoreBtn(`"${movie}"`,`${page}`,`${year}`,`"${type}"`)
    console.log(page)
})

function modal(){
    const modal=document.querySelector("div.modal")
    const bg=document.createElement("div")
    bg.classList.add("modal-background")
    const body=document.querySelector("body")
    body.append(bg)
    modal.style.display="block"
    modal.querySelector("div.material-symbols-outlined").addEventListener("click",()=>{
        bg.remove()
        modal.style.display="none"
        modal.parentNode.removeChild(modal)
    })
}

