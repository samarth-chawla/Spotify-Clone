console.log("kaam kr rha h console bohot shi")
// stroke-linecap="round" stroke-linejoin="round"

let currentSong = new Audio()
let songs;
let currFolder;


//To get songs from the folder
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5000/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}/`)[1].split(".mp3")[0])  //Split se do me break ho jaega but hume break ke baad ka chaiye isliye [1] kiya h (index no hai 1)
        }
    }

    //Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>  <img class="invert" src="music.svg">
                   <div class="info">
                       <div>${song.replaceAll("%20", " ")}</div>
                       <div>${song.replaceAll("%20", " ").split("-")[1]}</div>
                   </div>
                   <div class="playnow flex align-center">
                       Play Now
                       <img class="invert" src="playnow.svg" alt="play">
                   </div>  </li>`
    }
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/gaane/" + track)
    // audio.play();  in do line me saare gaane saath chl rhe hai isliye new method bnanenge jisme ik baar me ik hi song play hoye jiske liye humne ik global variable declare kr diya h jo bar baar update higa or play hoga 

    //To load the first song always 
    currentSong.src = `${currFolder}/` + track + ".mp3";
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

function convertSeconds(seconds) {
    // Ensure the input is a non-negative integer
    if (seconds < 0 || isNaN(seconds)) {
        return "00:00";
    }

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds with leading zeros if necessary
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time string
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5000/songs`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    // console.log(div)
    let cardContainer = document.querySelector(".cardContainer")
    let anchors = Array.from(div.getElementsByTagName("a"))
    for (let index = 0; index < anchors.length; index++) {
        const e = anchors[index];
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]    //to get folders name
            //to get the metadata of my folder
            let a = await fetch(`http://127.0.0.1:5000/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}"  class="card">
            <div class="play">
                <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24"
                    class="Svg-sc-ytk21e-0 bneLcE">
                    <path
                        d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                    </path>
                </svg>
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="Party Hits">
            <h2>${response.title}!</h2>
            <p>${response.description}!</p>
        </div> `
        }
    }
    //Load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Albums")
            
            songs = await getSongs(`SongS/${item.currentTarget.dataset.folder}`)
            // console.log(`${item.currentTarget.dataset.folder}`)
            // playMusic(songs[0],true)

            Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
                e.addEventListener("click", element => {
                    console.log(e.querySelector(".info").firstElementChild.innerHTML.trim())
                    playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
                })
                // //Add event listener to previous and next
                // previous.addEventListener("click", () => {
                //     // currentSong.pause()
                //     console.log(songs)
                //     // console.log(currentSong.src.split("/").slice(-1)[0].split(".mp3")[0])
                //     let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0].split(".mp3")[0])
                //     // console.log(index)
                //     if ((index - 1) >= 0) {
                //         // console.log(currentSong.src)
                //         playMusic(songs[index - 1])
                //     }
                // })
                // next.addEventListener("click", () => {
                //     // currentSong.pause()
                //     let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0].split(".mp3")[0])
                //     if ((index + 1) < songs.length) {
                //         // console.log(currentSong.src)
                //         // console.log(songs[index + 1])
                //         playMusic(songs[index + 1])
                //     }
                // })
            });

        })
    })
}

async function main() {

    //Get the lists of all songs 
    await getSongs("SongS/MonopolyMoves")
    playMusic(songs[0], true)

    //Display all the albums on the page
    displayAlbums()


    // //Play the first song
    // let audio = new Audio(songs[0])
    // audio.play();

    //Attach an event listsener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML.trim())
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    });

    //Attach an event listener to play next and previous songs 
    play.addEventListener("click", e => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })


    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${convertSeconds(currentSong.currentTime)}/${convertSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    //Add eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //Add event listener to hamburger 
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    //Add event listener to close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //Add event listener to previous and next
    previous.addEventListener("click", () => {
        // currentSong.pause()
        // console.log(songs)
        // console.log(currentSong.src.split("/").slice(-1)[0].split(".mp3")[0])
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0].split(".mp3")[0])
        // console.log(index)
        if ((index - 1) >= 0) {
            // console.log(currentSong.src)
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        // currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0].split(".mp3")[0])
        if ((index + 1) < songs.length) {
            // console.log(currentSong.src)
            // console.log(songs[index + 1])
            playMusic(songs[index + 1])
        }
    })


    //Add an event to volume range
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e, e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100
    })


}
main()