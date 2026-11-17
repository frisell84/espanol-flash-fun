# Spanish–Swedish flashcards

A beginner (A1) flashcard app: common Spanish words with Swedish translations.

There are 586 words in 12 categories: Fraser & vardag, Personer & familj, Mat & dryck, Djur & natur, Kropp & hälsa, Hem & saker, Kläder & färger, Tid & tal, Verb, Adjektiv & beskrivning, Stad & resa, and Skola & arbete.

You can flip the cards, switch ES → SV or SV → ES, hear the Spanish (and Swedish) with the browser's built-in speech, mark a card to practise again, and optionally play a quiet generated background loop. Progress is only kept for the current session. Nothing is stored on a server.

The idea, the word list, the categories and how it should feel are mine. The app was built with [Lovable](https://lovable.dev).

## How to run

You need Node.js and npm.

```sh
npm i
npm run dev
```

Open the local address printed by Vite.

```sh
npm run build
npm run preview
```

builds and previews a production bundle.

## Built with

Lovable, on its TanStack Start template: React 19, Vite, Tailwind, shadcn/ui. Pronunciation uses the Web Speech API (`es-ES`, `sv-SE`). The background "music" is generated in the browser with the Web Audio API (sine-wave chords). It is not a third-party track.

## Status

Works as a demo. The npm package name is still the template name `tanstack_start_ts`.

## Licence

MIT. See `LICENSE`. The word list is ordinary beginner vocabulary.

## Author

Mikael Frisell
