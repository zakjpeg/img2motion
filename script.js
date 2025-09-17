let btnInputFolder = document.getElementById("inputfolder");
let btnImageSelect = document.getElementById("imageselect");
let btnOutputFolder = document.getElementById("outputfolder");
let inpPrompt = document.getElementById("promptinput");
let btnGenerate = document.getElementById("generatebutton");
let inpApiKey = document.getElementById("keyinput");
let disImageCount = document.getElementById("imagecount");
let inpSecondCount = document.getElementById("secondsinput");

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
    disImageCount.innerHTML = imgCount + " " + ((imgCount > 1) ? "images" : "image");
    document.getElementById("countertext").classList.remove("hidden");

    // Update preview
    clearImagePreviews();

    // Collect dataURIs
    dataURIs = [];
    var iter = 4;
    Array.from(imgList).forEach((file) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            dataURIs.push(e.target.result); // this is the data URI string
            if (iter > 1) {
                newImagePreview(e.target.result, 0);
                iter = iter - 1;
            } else if (iter == 1) {
                newImagePreview(e.target.result, imgCount - 4);
                iter = iter - 1;
            }

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
    const secondsInput = parseInt(inpSecondCount.value, 10);

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
    if (secondsInput < 1 || secondsInput > 50) {
        alert("Please use a video length between 1 and 50 seconds");
        return;
    }
    if (!apiKey) {
        alert("Please enter your RunwayML API Key");
        return;
    }

    console.log("image list:", imgList);
    console.log("output folder:", outputFolder.name);
    console.log("prompt:", promptText);
    console.log("length:", secondsInput);
    console.log("api key:", apiKey);

    for (const URI of dataURIs) {
        try {
            
            const result = await fetch(
                "/api/img2video",
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        "promptImage": URI,
                        "seed": 4294967295,
                        "model": "gen4_turbo",
                        "promptText": promptText,
                        "duration": secondsInput,
                        "ratio": "720:1280",
                        "apiKey": apiKey,
                        "contentModeration": {
                            "publicFigureThreshold": "auto"
                        }
                    })
                }
            ).then(res => res.json());

        } catch (err) {
            console.error(err);
        }
    }

    // Loop through every image
    for (const URI of dataURIs) {

        /*
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
        */
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


// Function: newAccountComponent
// Purpose: Creates/Inserts a card with an argued name to your charts
// Input: String representing account name
// Output: None
//
function newImagePreview(imgUrl, remainCount) {
    const img = document.createElement('img');
    img.classList.add("imgpreview");
    img.src = imgUrl;

    document.getElementById("previewcollection").appendChild(img);

    if (remainCount > 0) {
        const div = document.createElement('div');
        div.classList.add("remainingcount");
        div.innerHTML = `+${remainCount} more`;
        document.getElementById("previewcollection").appendChild(div);
    }
}

// Function: clearImagePreviews
// Purpose: Clears the image previews
// input: none
// output: none
function clearImagePreviews() {
    document.getElementById("previewcollection").innerHTML = "";
}