Put your background music file in this folder (MP3 recommended), e.g. theme.mp3

Then open src/data/weddingConfig.js and set:
  music: {
    src: '/audio/entrysong.mp4',
    title: 'Song title',
    credit: 'Artist / licence',
    ...
  }

Only use music you have the rights to. If no file is set, a soft tanpura
drone is generated in the browser instead.


