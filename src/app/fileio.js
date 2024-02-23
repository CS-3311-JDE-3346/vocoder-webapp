const modulatorSelect = document.querySelector("#modulatorSelect");
const carrierSelect = document.querySelector("#carrierSelect");
const modulatorFileInput = document.querySelector("#modulator");
const carrierFileInput = document.querySelector("#carrier");
const runButton = document.querySelector("#runVocoder");
const downloadButton = document.querySelector("#downloadOutput");

let vocoder = null;

Module.onRuntimeInitialized = () => {
    vocoder = new Module.Vocoder();
    initControls();
    carrierFileInput.disabled = false;
    modulatorFileInput.disabled = false;
    runButton.disabled = false;
};

function initControls() {
    runButton.addEventListener("click", async (e) => {
        console.log("Running vocoder");
        let carrierIndex = parseInt(carrierSelect.value);
        let modulatorIndex = parseInt(modulatorSelect.value);
        vocoder.carrierIndex = carrierIndex;
        vocoder.modulatorIndex = modulatorIndex;

        if (carrierIndex == 0 && carrierFileInput.files[0] != undefined) {
            const f = carrierFileInput.files[0];
            try {
                const content = await getFileContent(f);
                if (content != null) {
                    console.log("writing file to FS");
                    const binary = new Uint8Array(content);
                    FS.writeFile("./Assets/" + carrierFileInput.files[0].name, binary, { flags: "w" });
                    vocoder.setCarrierFilename(carrierFileInput.files[0].name);
                }
            } catch (e) {
                console.warn(e.message);
            }
        }

        if (modulatorIndex == 0 && modulatorFileInput.files[0] != undefined) {
            const f = modulatorFileInput.files[0];
            try {
                const content = await getFileContent(f);
                if (content != null) {
                    console.log("writing file to FS");
                    const binary = new Uint8Array(content);
                    FS.writeFile("./Assets/" + modulatorFileInput.files[0].name, binary, { flags: "w" });
                    vocoder.setModulatorFilename(modulatorFileInput.files[0].name);
                }
            } catch (e) {
                console.warn(e.message);
            }
        }

        if (vocoder.run()) {
            downloadButton.disabled = false;
        }
    });
    downloadButton.addEventListener("click", (e) => {
        console.log("Downloading output");
        // https://stackoverflow.com/questions/54466870/emscripten-offer-to-download-save-a-generated-memfs-file
        try {
            let content = Module.FS.readFile("./Assets/out/output.wav");
            const a = document.createElement('a');
            a.download = "output.wav";
            a.href = URL.createObjectURL(new Blob([content], {type: "audio/wav"}));
            a.style.display = 'none';

            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(a.href);
            }, 2000);
        } catch (e) {
            console.error("OUTPUT FILE NOT WRITTEN");
            console.log(e);
        }
    });
}

// .function("setModulatorFilename", &Vocoder::setModulatorFilename)
// .function("setCarrierFilename", &Vocoder::setCarrierFilename)
// .function("run", &Vocoder::run)

// .property("carrierIndex", &Vocoder::getCarrierIndex, &Vocoder::setCarrierIndex)
// .property("modulatorIndex", &Vocoder::getModulatorIndex, &Vocoder::setModulatorIndex)

// https://blog.shovonhasan.com/using-promises-with-filereader/
async function getFileContent(file)
{
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onerror = () => {
        reader.abort();
        reject(new DOMException("Problem parsing input file."));
      };
  
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsArrayBuffer(file);
    });
}