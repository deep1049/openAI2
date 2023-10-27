import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Textarea,
  VStack,
  Spinner,
  Center,
  Heading,
  Text,
} from "@chakra-ui/react";

function TextGeneration() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    setIsLoading(true);

    const newMessages = [...messages, { role: "user", content: inputMessage }];
    setMessages(newMessages);
    setInputMessage("");

    // Send the user message to the backend for text generation
    try {
      const response = await axios.post("http://localhost:8080/text", {
        messages: newMessages,
      });
      setMessages([
        ...newMessages,
        { role: "assistant", content: response.data.message.content },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack
      p={4}
      w={800}
      margin={"auto"}
      border={"1px solid black"}
      mt={50}
      borderRadius={"10px"}
    >
      <Heading>Text Generation with Context</Heading>
      {isLoading && (
        <Center>
          <Spinner size="lg" />
        </Center>
      )}
      <VStack spacing={2} align="stretch">
        {messages.map((message, index) => (
          <div key={index} className={message.role}>
            <Text fontWeight={"bold"}>{message.content}</Text>
          </div>
        ))}
      </VStack>
      <Textarea
        placeholder="Enter your message"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <Button colorScheme="teal" onClick={handleSendMessage}>
        Send
      </Button>
    </VStack>
  );
}

export default TextGeneration;
