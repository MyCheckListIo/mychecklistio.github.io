// particles-config.js

particlesJS('particles-js', {
  particles: {
    number: {
      value: 350,
      density: {
        enable: true,
        value_area: 1200
      }
    },
    color: {
      value: '#ffffff' // Color de las partículas
    },
    shape: {
      type: 'circle', // Tipo de forma de las partículas
      stroke: {
        width: 0,
        color: '#000000'
      },
      polygon: {
        nb_sides: 5
      }
    },
    opacity: {
      value: 0.4,
      random: true,
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 1.5,
      random: true,
      anim: {
        enable: true,
        speed: 1,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: false,
      distance: 50,
      color: '#ffffff',
      opacity: 0.4,
      width: 0.2
    },
    move: {
      enable: true,
      speed: 0.5,
      direction: 'top',
      random: true,
      straight: false,
      out_mode: 'out',
      bounce: true,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: true,
        mode: 'attract'
      },
      onclick: {
        enable: true,
        mode: 'push'
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1
        }
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3
      },
      repulse: {
        distance: 100,
        duration: 0.8
      },
      push: {
        particles_nb: 12
      },
      remove: {
        particles_nb: 2
      }
    }
  },
  retina_detect: true
});
