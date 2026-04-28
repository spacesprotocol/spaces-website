// Tab switching logic for code block
function switchCodeTab(lang) {
    const blocks = ['rust', 'js', 'go', 'swift', 'kotlin', 'python'];
    blocks.forEach(b => {
        document.getElementById(`code-${b}`).classList.add('hidden');
        document.getElementById(`code-${b}`).classList.remove('block');

        const btn = document.getElementById(`tab-${b}`);
        btn.classList.remove('tab-active');
        btn.classList.add('tab-inactive');
    });

    document.getElementById(`code-${lang}`).classList.remove('hidden');
    document.getElementById(`code-${lang}`).classList.add('block');

    const activeBtn = document.getElementById(`tab-${lang}`);
    activeBtn.classList.remove('tab-inactive');
    activeBtn.classList.add('tab-active');
}

// Handle animation
const prefixElement = document.getElementById("handle-prefix");
const suffixElement = document.getElementById("handle-suffix");
const rootElement = document.getElementById("merkle-root");
const glowElement = document.getElementById("hash-glow");
const hashContainer = document.getElementById("hash-container");

const protocolData = [
    {
        suffix: "@bitcoin",
        root: "0xe3b0...985a",
        prefixes: ["alice", "bob", "satoshi", "builder", "miner"]
    },
    {
        suffix: "@nostr",
        root: "0x8f2a...1b4d",
        prefixes: ["damus", "jack", "relay", "zap", "note"]
    },
    {
        suffix: "@dev",
        root: "0x5c7e...3f9a",
        prefixes: ["api", "git", "status", "test", "main"]
    }
];

const scrambleChars = "abcdef0123456789";
const FRAME_DELAY = 2;

function scrambleText(element, finalString, duration = 300) {
    return new Promise(resolve => {
        const startTime = performance.now();
        const originalLength = element.innerText.length;
        let frameCount = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            if (frameCount++ % FRAME_DELAY === 0) {
                const currentLen = Math.floor(originalLength + (finalString.length - originalLength) * progress);
                let currentString = "";
                const resolveIndex = Math.floor(progress * finalString.length);

                for (let i = 0; i < Math.max(currentLen, resolveIndex); i++) {
                    if (i < resolveIndex) {
                        currentString += finalString[i];
                    } else {
                        currentString += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                    }
                }
                element.innerText = currentString;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.innerText = finalString;
                resolve();
            }
        }

        requestAnimationFrame(update);
    });
}

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateMerkleRoot(newRoot) {
    glowElement.style.opacity = "1";
    hashContainer.classList.add("border-neutral-700", "bg-neutral-800");
    await scrambleText(rootElement, newRoot, 250);
    await wait(100);
    glowElement.style.opacity = "0";
    hashContainer.classList.remove("border-neutral-700", "bg-neutral-800");
}

async function runSequence() {
    let nsIndex = 0;

    while (true) {
        const currentNS = protocolData[nsIndex];

        for (let i = 0; i < currentNS.prefixes.length; i++) {
            const prefix = currentNS.prefixes[i];

            if (i === 0) {
                updateMerkleRoot(currentNS.root);
                const p1 = scrambleText(suffixElement, currentNS.suffix, 400);
                const p2 = scrambleText(prefixElement, prefix, 400);
                await Promise.all([p1, p2]);
            } else {
                await scrambleText(prefixElement, prefix, 350);
            }

            await wait(1200);
        }

        nsIndex = (nsIndex + 1) % protocolData.length;
    }
}

document.addEventListener('DOMContentLoaded', runSequence);