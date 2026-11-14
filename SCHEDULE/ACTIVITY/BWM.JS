const ASSETS = {
    offImage:        "porscheoff.jpg",    
    transitionVideo: "porschemp4.mp4",    
    keyImage:        "key.png",           
    engineSound:     "porsche-sound.mp3", 
    videoMuted:      false,              
    videoVolume:     1.0,                 
    engineVolume:    0.7
};

const COPY = {
    title: "PORSCHE 911 GT2 RS",
    text:  "The Porsche engineers knew exactly what their objective was: to make the new 911 GT2 RS the most powerful Porsche for the road. Objective achieved."
};

(() => {
    const body   = document.body;
    const offImg = document.getElementById('offLayer');
    const video  = document.getElementById('videoLayer');
    const keyBtn = document.getElementById('keyBtn');
    const keyImg = document.getElementById('keyImg');

    document.getElementById('adTitle').textContent = COPY.title;
    document.getElementById('adText').textContent  = COPY.text;

    offImg.src    = ASSETS.offImage;
    video.poster  = ASSETS.offImage;    
    video.src     = ASSETS.transitionVideo;
    video.muted   = ASSETS.videoMuted;
    video.volume  = ASSETS.videoVolume;
    video.playsInline = true;
    video.load();

    keyImg.addEventListener('error', () => keyBtn.classList.add('no-img'));
    keyImg.src = ASSETS.keyImage;

    const makeAudio = (src, vol) => {
        if (!src) return null;
        const a = new Audio();
        a.preload = 'auto';
        a.src = src;
        a.volume = vol;
        a.load();
        return a;
    };
    const engine = makeAudio(ASSETS.engineSound, ASSETS.engineVolume);

    const safePlay = (media) => {
        if (!media) return;
        const p = media.play();
        if (p && typeof p.catch === 'function') p.catch(err => console.warn('Play failed:', err));
    };
    const rewind = (media) => {
        if (!media) return;
        media.pause();
        try { media.currentTime = 0; } catch (e) {}
    };

    let state = 'off';

    function setUI(isOn) {
        body.classList.toggle('on', isOn);
        keyBtn.setAttribute('aria-pressed', String(isOn));
    }

    function turnOn() {
        state = 'on';
        setUI(true);

        rewind(video); rewind(engine);
        video.classList.add('show');
        safePlay(video);
        safePlay(engine);
    }

    function turnOff() {
        state = 'off';
        setUI(false);

        rewind(video); rewind(engine);
        video.classList.remove('show');
    }

    video.addEventListener('error', () => {
        console.warn('Video error code:', video.error && video.error.code, '| file:', video.currentSrc);
    });

    keyBtn.addEventListener('click', () => {
        if (state === 'off') turnOn();
        else turnOff();
    });
})();