import {
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  Input,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedFiles(files);
  };

  const handleSubmit = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Please select at least one file for summarization.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/summarization",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setGeneratedSummary(response.data.summary);
    } catch (error) {
      console.error("Error while making the POST request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      p={4}
      w={800}
      margin={"auto"}
      border={"1px solid black"}
      mt={50}
      borderRadius={"10px"}
    >
      <Heading>Multi Doc Summarization</Heading>

      <Box>
        <FormLabel>Select Files</FormLabel>
        <Input type="file" multiple onChange={handleFileChange} />
      </Box>
      <Button onClick={handleSubmit}>Generate Summary</Button>

      {isLoading && <p>Loading...</p>}

      {generatedSummary && (
        <bOX>
          <Heading>Generated Summary:</Heading>
          <Text>{generatedSummary}</Text>
        </bOX>
      )}
    </Box>
  );
};

export { FileUpload };
