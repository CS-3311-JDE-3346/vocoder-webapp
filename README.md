# Learn Vocoders
Learn Vocoders is a website that helps users learn more about vocoders! Users will eventually be able to run a vocoder, learn more about vocoders, and save their progress via their account. This repository houses the frontend portion of the app, created using NextJS.

# Release Notes
## Version 0.5.0
### New Features
- User can now reorder the signal and output components of the vocoder, using the drag handles on the right side of the screen

### Bug Fixes
- Resolved issue where the user has to refresh the page after they record a modulator signal

### Known Issues
- If the user renames a run to the same name as an existing run, they may run into an issue

## Version 0.4.0
### New Features
- Additions to the education page to explain how vocodes are used.
- Added explanation mode with popups.
- Users can now sync vocoder inputs and outputs with account.
- File menu and custom vocoder input.

### Bug Fixes
- Improved stability of vocoder across different machines and operating systems
- User can export MIDI file

### Known Issues
- If you record a modulator signal, it requires a page reload in order to see it

## Version 0.3.0
### New Features
- Users can now export learning content as PDF.
- Users can now specify the midi file to be used in the vocoder, and change the character of the synthesizer
- Users can now select from "teacher" and "student" in a new profile popup for their account.
- Users can now track learning progress by marking sections as "complete".
- Users can change synth.
- Users can now view basic educational information about vocoders on the education page.
- Users can now view educational information about popular music that uses vocoders on the educational page.

### Bug Fixes
- Fixed invalid MIDI file error.

### Known Issues
- Vocoder experiences inability to run on some machines.
- Browser prevents exporting of MIDI file ran through vocoder.

## Version 0.2.0
### New Features
 - Users can now navigate to a learning page
 - Users can now upload and listen to midi files

### Bug Fixes
- Identity of back-end setup segmentation fault uncovered. Attempting to run Projucer in a WSL shell, as opposed to a WSL desktop environment, might return a null pointer to a desktop instance whose members are attempted to be accessed. The solution is to configure a remote desktop in WSL and setup the back-end there.
- Creating a new waveform with the same name as an existing waveform creates an error
- Recording a modulator signal should display a border around the empty waveform

### Known Issues
- User can unselect a midi file, resulting in undefined behavior
- Midi file not linked to carrier signal yet, so currently not very useful
- Selecting an invalid midi file results in an error

## Version 0.1.0
### New Features
- Users can now upload a custom carrier signal
- Users can record their own modulator signal directly on the website
- Users can sign in and sign out
- Users can apply filters to carrier and modulator signal.

### Bug Fixes
- None yet

### Known Issues
- Creating a new waveform with the same name as an existing waveform creates an error
- Users can upload non .wav files, but backend assumes it recieves a .wav file
- Recording a modulator signal should display a border around the empty waveform
- Attempting to build the backend leads to a segmentation fault.

# Sprint 1 Notes
For Sprint 1, we focused on the front end on creating the basic main vocoder page. This is because
our main goal for the first sprint was to get a basic vocoder working so that we could then
build out future educational aspects off the basic vocoder. We thought that this way would be
easier for us as well as coding out the vocoder ourselves would also give us knowledge in vocoders
ourselves, which would make implementing the educational aspects later even easier for us.


Our technologies used are Next.js, React, and JUCE, and the programming languages used are JavaScript, HTML, CSS, and C. Since this is a website, it can work on any platform or device with a web browser.

# Install Guide
## Pre-requisites
Ensure Node, ffmpeg, fluidsynth, and gcc are installed on your system.

## Installation 
1. Run git clone `https://github.com/CS-3311-JDE-3346/3346-vocoder-webapp.git` to download the repository onto the machine
2. Run `npm i` to install all npm packages
3. Ask Akash Misra to add you to the Firebase app (or create a new one), then go to Project Settings, Service Accounts, and generate a new key
4. Rename the key to "serviceAccountKey.json" and move it to the root folder of the repository. Ensure this file never gets added to the Github repository
5. In any folder, run `https://github.com/blastbay/voclib`
6. Run `cd voclib` and then run `gcc shell/vocshell.c -o vocoder`
7. Move the vocoder file into the root folder of the vocoder-webapp folder

## Local Development
First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Troubleshooting
- If the backend says that a command failed, ensure that Fluidsynth and ffmpeg are on your system path, and that you can access it from any terminal
- In order for runs to save properly, ensure you have included the "serviceAccountKey.json" file in the root folder

# References
Sound files: https://thewolfsound.com/sine-saw-square-triangle-pulse-basic-waveforms-in-synthesis/
Sound fonts: https://sites.google.com/site/soundfonts4u/ 
