const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

let player = {
    hp: 100,
    xp: 0,
    currentQuest: 0,
};

const quests = [
    { question: "What layer does a router operate on?", options: ["Layer 1", "Layer 2", "Layer 3", "Layer 4"], answer: "Layer 3", reward: 10 },
    { question: "Which protocol is connectionless?", options: ["TCP", "HTTP", "UDP", "FTP"], answer: "UDP", reward: 15 },
    { question: "What does HTTP status code 404 mean?", options: ["OK", "Moved Permanently", "Bad Request", "Not Found"], answer: "Not Found", reward: 10 }
];

app.get("/", (req, res) => {
    res.send("Network RPG Game Backend is Running!");
});

app.get("/quest", (req, res) => {
    if (player.currentQuest >= quests.length) {
        return res.json({ message: "You have completed all quests!", player });
    }
    res.json({ 
        question: quests[player.currentQuest].question, 
        options: quests[player.currentQuest].options, 
        player 
    });
});

app.post("/answer", (req, res) => {
    const { answer } = req.body;
    const quest = quests[player.currentQuest];
    if (!quest) {
        return res.json({ message: "No more quests!" });
    }
    if (answer === quest.answer) {
        player.xp += quest.reward;
        player.currentQuest += 1;
        res.json({ 
            message: "Correct!", 
            xpGained: quest.reward, 
            nextQuest: player.currentQuest,
            animation: "correct-answer-animation" 
        });
    } else {
        player.hp -= 10;
        res.json({ 
            message: "Wrong answer!", 
            hpLost: 10, 
            nextQuest: player.currentQuest,
            animation: "wrong-answer-animation" 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
