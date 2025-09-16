let btnInputFolder = document.getElementById("inputfolder");
let btnImageSelect = document.getElementById("imageselect");
let btnOutputFolder = document.getElementById("outputfolder");
let inpPrompt = document.getElementById("promptinput");
let btnGenerate = document.getElementById("generatebutton");
let inpApiKey = document.getElementById("keyinput");
let disImageCount = document.getElementById("imagecount");

let imgList = false;
let dataURIs = false;
let outputFolder = false;

const allowedExtensions = ["jpeg", "jpg", "png"];
var imgCount = 0;


/* Event Listeners */
btnInputFolder.addEventListener('click', async () => {
    // trigger file picker
    btnImageSelect.click();
})

btnImageSelect.addEventListener('change', async (event) => {
    // update file count
    imgList = event.target.files;
    imgCount = imgList.length;
    disImageCount.innerHTML = imgCount;

    // Collect dataURIs
    dataURIs = [];
    Array.from(imgList).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            dataURIs.push(e.target.result); // this is the data URI string
        };
        reader.readAsDataURL(file);
    });

    console.log("dataURIs:", dataURIs);
})

btnOutputFolder.addEventListener('click', async () => {
    // get output folder
    outputFolder = await getFileDirectory();
    // console.log("output folder:", outputFolder.name);
})

btnGenerate.addEventListener('click', async () => {

    const promptText = inpPrompt.value;
    const apiKey = inpApiKey.value;

    // Check for missing info
    if (!imgList) {
        alert("Please select input images");
        return;
    }
    if (!outputFolder) {
        alert("Please select an output folder");
        return;
    }
    if (!promptText) {
        alert("Please enter a prompt");
        return;
    }
    if (!apiKey) {
        alert("Please enter your RunwayML API Key");
        return;
    }

    console.log("image list:", imgList);
    console.log("output folder:", outputFolder.name);
    console.log("prompt:", promptText);
    console.log("api key:", apiKey);


    // Loop through every image
    for (const URI of dataURIs) {

        try {
            // RunwayML API Request
            const result = await fetch(
                "https://api.dev.runwayml.com/v1/image_to_video",
                {
                    method: "POST",
                    headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "X-Runway-Version": "2024-11-06",
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                    "promptImage": URI,
                    "seed": 4294967295,
                    "model": "gen4_turbo",
                    "promptText": promptText,
                    "duration": 5,
                    "ratio": "720:1280",
                    "contentModeration": {
                        "publicFigureThreshold": "auto"
                    }
                    }),
                },
            ).then(res => res.json()); // End request

            console.log("Video request created:", result);
        } catch (err) {
            console.error(err);
        }
    } // End Loop


})


/* Functions */
async function getFileDirectory() {
    try {
        const userSelection = await window.showDirectoryPicker({ mode: 'read' });
        // console.log("Selected folder:", userSelection.name);
        
        return userSelection;

    } catch (err) {
        console.log(err);
    }
}