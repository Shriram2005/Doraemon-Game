// Audio Manager Class - Handles all audio in the game
class AudioManager {
    constructor() {
        this.listener = new THREE.AudioListener();
        this.audioLoader = new THREE.AudioLoader();
        this.sounds = {};
        this.backgroundMusic = null;
        this.isEnabled = true;
        this.volume = 0.5;
        
        this.init();
    }
    
    init() {
        // Create audio context for web audio
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.setupSounds();
    }
    
    setupSounds() {
        // Background music (procedurally generated)
        this.createBackgroundMusic();
        
        // Footstep sounds
        this.createFootstepSounds();
        
        // Jump sound
        this.createJumpSound();
        
        // Ambient sounds
        this.createAmbientSounds();
        
        // UI sounds
        this.createUISounds();
    }
    
    createBackgroundMusic() {
        // Create a simple peaceful melody using Web Audio API
        const duration = 60; // 60 seconds loop
        const sampleRate = 44100;
        const buffer = this.audioContext.createBuffer(2, duration * sampleRate, sampleRate);
        
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            
            for (let i = 0; i < channelData.length; i++) {
                const time = i / sampleRate;
                
                // Create a simple melody with multiple harmonics
                let sample = 0;
                
                // Main melody - peaceful sine waves
                sample += Math.sin(2 * Math.PI * 220 * time) * 0.1; // A3
                sample += Math.sin(2 * Math.PI * 330 * time) * 0.08; // E4
                sample += Math.sin(2 * Math.PI * 440 * time) * 0.06; // A4
                
                // Add some variation
                const modulation = Math.sin(2 * Math.PI * 0.1 * time) * 0.02;
                sample += modulation;
                
                // Apply envelope
                const envelope = Math.max(0, 1 - (time % 8) / 8) * 0.3;
                sample *= envelope;
                
                // Add some reverb-like effect
                const delay = Math.sin(2 * Math.PI * 220 * (time - 0.1)) * 0.02;
                sample += delay;
                
                channelData[i] = sample;
            }
        }
        
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = 0.3;
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        this.backgroundMusic = {
            source: source,
            gainNode: gainNode,
            isPlaying: false
        };
    }
    
    createFootstepSounds() {
        // Create footstep sounds using noise
        const steps = ['step1', 'step2', 'step3', 'step4'];
        
        steps.forEach((stepName, index) => {
            const duration = 0.2;
            const sampleRate = 44100;
            const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
            const channelData = buffer.getChannelData(0);
            
            for (let i = 0; i < channelData.length; i++) {
                const time = i / sampleRate;
                
                // Create footstep sound using filtered noise
                let sample = (Math.random() * 2 - 1) * 0.5; // White noise
                
                // Apply envelope
                const envelope = Math.exp(-time * 10) * (1 - time / duration);
                sample *= envelope;
                
                // Add some low frequency component
                sample += Math.sin(2 * Math.PI * 60 * time) * envelope * 0.3;
                
                channelData[i] = sample;
            }
            
            this.sounds[stepName] = buffer;
        });
    }
    
    createJumpSound() {
        const duration = 0.3;
        const sampleRate = 44100;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const channelData = buffer.getChannelData(0);
        
        for (let i = 0; i < channelData.length; i++) {
            const time = i / sampleRate;
            
            // Create jump sound - ascending frequency
            const frequency = 200 + (time / duration) * 400;
            let sample = Math.sin(2 * Math.PI * frequency * time) * 0.4;
            
            // Apply envelope
            const envelope = Math.exp(-time * 5) * (1 - time / duration);
            sample *= envelope;
            
            channelData[i] = sample;
        }
        
        this.sounds.jump = buffer;
    }
    
    createAmbientSounds() {
        // Bird sounds
        this.createBirdSounds();
        
        // Wind sounds
        this.createWindSounds();
    }
    
    createBirdSounds() {
        const duration = 2;
        const sampleRate = 44100;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const channelData = buffer.getChannelData(0);
        
        for (let i = 0; i < channelData.length; i++) {
            const time = i / sampleRate;
            
            // Create bird chirp sounds
            let sample = 0;
            
            // Multiple bird calls
            if (time < 0.5) {
                sample = Math.sin(2 * Math.PI * 1200 * time) * Math.exp(-time * 8) * 0.2;
            } else if (time > 1 && time < 1.3) {
                const t = time - 1;
                sample = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 10) * 0.15;
            }
            
            channelData[i] = sample;
        }
        
        this.sounds.birds = buffer;
    }
    
    createWindSounds() {
        const duration = 5;
        const sampleRate = 44100;
        const buffer = this.audioContext.createBuffer(2, duration * sampleRate, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = buffer.getChannelData(channel);
            
            for (let i = 0; i < channelData.length; i++) {
                const time = i / sampleRate;
                
                // Create wind sound using filtered noise
                let sample = (Math.random() * 2 - 1) * 0.1;
                
                // Apply low-pass filtering effect
                const modulation = Math.sin(2 * Math.PI * 0.5 * time) * 0.5 + 0.5;
                sample *= modulation;
                
                channelData[i] = sample;
            }
        }
        
        this.sounds.wind = buffer;
    }
    
    createUISounds() {
        // Button click sound
        const duration = 0.1;
        const sampleRate = 44100;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const channelData = buffer.getChannelData(0);
        
        for (let i = 0; i < channelData.length; i++) {
            const time = i / sampleRate;
            
            // Create click sound
            let sample = Math.sin(2 * Math.PI * 800 * time) * 0.3;
            sample += Math.sin(2 * Math.PI * 1200 * time) * 0.2;
            
            // Apply envelope
            const envelope = Math.exp(-time * 50);
            sample *= envelope;
            
            channelData[i] = sample;
        }
        
        this.sounds.click = buffer;
    }
    
    playBackgroundMusic() {
        if (!this.isEnabled || !this.backgroundMusic) return;
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        if (!this.backgroundMusic.isPlaying) {
            this.backgroundMusic.source.start();
            this.backgroundMusic.isPlaying = true;
        }
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
            this.backgroundMusic.source.stop();
            this.backgroundMusic.isPlaying = false;
        }
    }
    
    playSound(soundName, volume = 1.0, loop = false) {
        if (!this.isEnabled || !this.sounds[soundName]) return null;
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        const source = this.audioContext.createBufferSource();
        source.buffer = this.sounds[soundName];
        source.loop = loop;
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = volume * this.volume;
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        source.start();
        
        return { source, gainNode };
    }
    
    playFootstep() {
        const stepSounds = ['step1', 'step2', 'step3', 'step4'];
        const randomStep = stepSounds[Math.floor(Math.random() * stepSounds.length)];
        this.playSound(randomStep, 0.3);
    }
    
    playJump() {
        this.playSound('jump', 0.5);
    }
    
    playAmbientBirds() {
        this.playSound('birds', 0.2, false);
        
        // Schedule next bird sound
        setTimeout(() => {
            if (this.isEnabled) {
                this.playAmbientBirds();
            }
        }, Math.random() * 10000 + 5000); // Random between 5-15 seconds
    }
    
    playAmbientWind() {
        this.playSound('wind', 0.1, true);
    }
    
    playUIClick() {
        this.playSound('click', 0.8);
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        if (this.backgroundMusic && this.backgroundMusic.gainNode) {
            this.backgroundMusic.gainNode.gain.value = 0.3 * this.volume;
        }
    }
    
    mute() {
        this.isEnabled = false;
        this.stopBackgroundMusic();
    }
    
    unmute() {
        this.isEnabled = true;
        this.playBackgroundMusic();
    }
    
    toggle() {
        if (this.isEnabled) {
            this.mute();
        } else {
            this.unmute();
        }
    }
    
    // Start ambient sounds
    startAmbientSounds() {
        if (!this.isEnabled) return;
        
        // Start bird sounds with random intervals
        setTimeout(() => this.playAmbientBirds(), Math.random() * 5000 + 2000);
        
        // Start wind sounds
        this.playAmbientWind();
    }
    
    // Clean up
    dispose() {
        this.stopBackgroundMusic();
        
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}
