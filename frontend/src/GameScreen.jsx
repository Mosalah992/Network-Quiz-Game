import React, { useState, useEffect } from "react";
import { Button, Text, VStack } from "@chakra-ui/react";

function GameScreen() {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/quest")
      .then((res) => res.json())
      .then((data) => setQuestion(data.question));
  }, []);

  const handleAnswer = (option) => {
    setSelectedOption(option);
    fetch("http://localhost:3000/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: option }),
    })
      .then((res) => res.json())
      .then((data) => {
        setFeedback(data.message);
        if (data.nextQuest !== undefined) {
          fetch("http://localhost:3000/quest")
            .then((res) => res.json())
            .then((data) => setQuestion(data.question));
        }
      });
  };

  if (!question) return <Text>Loading...</Text>;

  return (
    <VStack
      spacing={4}
      p={5}
      textAlign="center"
      fontFamily="'Press Start 2P', cursive"
    >
      <Text fontSize="xl" fontWeight="bold" color="#fff">
        {question.question}
      </Text>
      {question.options.map((option, index) => (
        <Button
          key={index}
          onClick={() => handleAnswer(option)}
          backgroundColor="#ffcc00"
          color="#000"
          border="2px solid #000"
          _hover={{
            backgroundColor: "#ff9900",
            transform: "scale(1.05)",
          }}
          _active={{
            transform: "scale(0.95)",
          }}
          fontFamily="'Press Start 2P', cursive"
        >
          {option}
        </Button>
      ))}
      {feedback && <Text color="#fff">{feedback}</Text>}
    </VStack>
  );
}

export default GameScreen;
