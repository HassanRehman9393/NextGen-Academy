import React from 'react';
import Particles from "react-particles";
import { loadFull } from "tsparticles";

const AuthBackground = () => {
    const particlesInit = async (main) => {
        await loadFull(main);
    };

    const particlesConfig = {
        fullScreen: false,
        particles: {
            number: {
                value: 100,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#ffffff"
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.08,
                random: {
                    enable: true,
                    minimumValue: 0.04
                }
            },
            size: {
                value: 3,
                random: {
                    enable: true,
                    minimumValue: 1
                }
            },
            links: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.08,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: false,
                straight: false,
                outModes: {
                    default: "bounce"
                },
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "window",
            events: {
                onHover: {
                    enable: true,
                    mode: ["grab", "bubble"]
                },
                onClick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    links: {
                        opacity: 0.2
                    }
                },
                bubble: {
                    distance: 200,
                    size: 5,
                    duration: 2,
                    opacity: 0.3
                },
                push: {
                    quantity: 4
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                }
            }
        },
        background: {
            color: "transparent"
        },
        retina_detect: true
    };

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={particlesConfig}
            className="absolute inset-0"
        />
    );
};

export default AuthBackground; 