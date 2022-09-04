// A list of all possible colors
const COLORS = ['red', 'blue', 'green', 'yellow', 'pink', 'purple'];
// Defines the particle number
const PARTICLES_NUMBER = 20;

// here no need in class, just 2 usual util functions
export default class Particles {
    create(x: number, y: number, text = '', color?: string, style?: string) {
        const element = document.createElement('div');
        element.classList.add('particle', `${style}`);
        element.innerHTML = text;
        // The elements are in absolute position
        element.style.position = 'absolute';
        element.style.top = `${y}px`;
        element.style.left = `${x}px`;
        element.style.color = `#fff`;
        element.style.zIndex = `100`;
        // We want our cursor to be centered in the square
        element.style.transform = 'translate(-50%, -50%)';

        // Get a color randomly
        if (!color || color == '') {
            element.style.backgroundColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        } else {
            element.style.backgroundColor = color;
        }

        const animation = element.animate(
            [
                {
                    // Math.random() - 0.5 returns integer between -0.5 and 0.5
                    transform: `translate(${(Math.random() - 0.5) * 500}px, ${(Math.random() - 0.5) * 500}px) rotate(${
                        Math.random() * 520
                    }deg)`,
                    // We want to reduce the opacity until 0
                    opacity: 0,
                },
            ],
            3000
        );

        // Remove the particle at the end of animation
        // extra fn wrapper
        document.body.appendChild(element);
        animation.finished.then(() => {
            element.remove();
        });
    }

    getOffset(element: HTMLElement | SVGElement) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
        };
    }

    // unused
    addClickHandler() {
        document.addEventListener('click', (e) => {
            // Get the position of the cursor in the document
            const { clientX: x, clientY: y } = e;

            // Create multiple particles
            for (let i = 0; i < PARTICLES_NUMBER; i++) {
                // do not use "" as valid value if it's not
                this.create(x, y);
            }
        });
    }
}
