"use strict";

class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({
                from,
                to,
                start,
                end
            });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let {
                from,
                to,
                start,
                end,
                char
            } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// ——————————————————————————————————————————————————
// Example
// ——————————————————————————————————————————————————

const phrases = [' Vaas konuşuyor', 'merhaba tatlı bayan', 
'öncelikle nude istemiyorum\' ve hayır', 'abaza da değilim',
 'yataktaki iddialarımızı yeri geldiğinde ortaya koyarız',
  'bana güvenmeme sebebine hak versem de ', 
  'kalitemi ortaya koyduğumu düşünüyorum',
  'Bu arada evet yazılımcıyım',
  'Haydi bana güven ve  çok kaliteli datelere çıkalım',
  'Zira sanat kokan bir bayansın',
   'Var oluşsal sancılar geçirelim beraber ', 
   'Tarkovski izleyelim \' Bu arada', 'anal denemiş miydin?',
    'Kalitemiz ortadayken bize güvenmemen bizi üzer deriz.', 
    'Ara beni yala beni ', 
    '0554 644 38 62 ', 
   
       ];
const el = document.querySelector('.text');
const fx = new TextScramble(el);
let counter = 0;
const next = () => {
    fx.setText(phrases[counter]).then(() => {
        setTimeout(next, 800);
    });
    counter = (counter + 1) % phrases.length;
};
next();