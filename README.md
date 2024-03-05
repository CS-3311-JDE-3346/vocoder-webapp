# Learn Vocoders
Learn Vocoders is a website that helps users learn more about vocoders! Users will eventually be able to run a vocoder, learn more about vocoders, and save their progress via their account. This repository houses the frontend portion of the app, created using NextJS.

# Release Notes
## Version 0.3.0
### New Features
- Users can now export learning content as PDF.
- Users can now specify the midi file to be used in the vocoder

### Bug Fixes

### Known Issues

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

# Getting Started
## Installation
Ensure Node, ffmpeg, and fluidsynth are installed on your system
Run `npm i`

## Local Development
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

# References
Sound files: https://thewolfsound.com/sine-saw-square-triangle-pulse-basic-waveforms-in-synthesis/
Sound fonts: https://sites.google.com/site/soundfonts4u/ 