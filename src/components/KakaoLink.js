// src/components/KakaoLink.js

import React, { useState, useEffect, useCallback } from "react";
import {
  Paper,
  TextField,
  Button,
  Card,
  CardMedia,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled Components using MUI v5's styled API
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const HiddenInput = styled("input")({
  display: "none",
});

const ImagePreviewCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  marginTop: theme.spacing(2),
}));

// Define the type for the Kakao SDK response (optional, for better clarity)
const KakaoUploadResponse = (response) => {
  // This is a placeholder. In a real-world scenario, you might want to validate the response structure.
  return response && response.infos && response.infos.original.url;
};

const KakaoLink = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize Kakao SDK
  useEffect(() => {
    const kakaoAppKey = process.env.REACT_APP_KAKAO_APP_KEY;
    if (!kakaoAppKey) {
      setError("Kakao App Key is not defined in environment variables.");
      return;
    }

    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoAppKey); // Initialize with environment variable
    }

    // Cleanup function to revoke object URLs
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const sendLink = useCallback(
    (imageUrl) => {
      const linkData = {
        objectType: imageUrl ? "feed" : "text",
        link: {
          mobileWebUrl: imageUrl || "",
          webUrl: imageUrl || "",
        },
      };

      if (imageUrl) {
        linkData.content = {
          title: "공유 메시지",
          description: text,
          imageUrl: imageUrl,
          link: {
            webUrl: imageUrl,
            mobileWebUrl: imageUrl,
          },
        };
      } else {
        linkData.text = text;
      }

      window.Kakao.Link.sendDefault(linkData);

      // Reset state
      setText("");
      setFile(null);
      setPreviewUrl("");
    },
    [text]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!text.trim()) {
        setError("메시지를 입력해주세요.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        let imageUrl = "";

        if (file) {
          const response = await window.Kakao.Link.uploadImage({
            file: file,
          });

          imageUrl = KakaoUploadResponse(response);
          if (!imageUrl) {
            throw new Error("이미지 업로드에 실패했습니다.");
          }
        }

        sendLink(imageUrl);
      } catch (err) {
        console.error("Error uploading image or sending link:", err);
        setError("링크 전송 중 오류가 발생했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    },
    [file, text, sendLink] // Included 'sendLink' in dependencies
  );

  const handleTextChange = useCallback(
    (e) => {
      const maxChars = file ? 100 : 200;
      if (e.target.value.length <= maxChars) {
        setText(e.target.value);
        setError("");
      } else {
        setError(`메시지는 최대 ${maxChars}자까지 입력 가능합니다.`);
      }
    },
    [file]
  );

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      // Validate file type (image only)
      if (!selectedFile.type.startsWith("image/")) {
        setError("이미지 파일만 업로드할 수 있습니다.");
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (selectedFile.size > maxSize) {
        setError("파일 크기는 5MB를 초과할 수 없습니다.");
        return;
      }

      const localUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(localUrl);
      setFile(selectedFile);
      setError("");
    }
  }, []);

  const handleReset = useCallback(() => {
    setText("");
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
    setError("");
  }, [previewUrl]);

  return (
    <StyledPaper elevation={1}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="메시지"
          placeholder={
            file
              ? "이미지 첨부 시 최대 100자까지 전송 가능합니다."
              : "한번에 200자까지만 전송 가능 (이미지 첨부할 경우 100자만 가능)"
          }
          fullWidth
          autoFocus
          multiline
          rows={5}
          variant="outlined"
          value={text}
          onChange={handleTextChange}
          sx={{ mb: 2 }}
          inputProps={{ maxLength: file ? 100 : 200 }}
          helperText={`${text.length}/${file ? 100 : 200}`}
        />
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleReset}
            disabled={loading}
          >
            다시 쓰기
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            id="kakao-link-btn"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "카톡 전송"}
          </Button>
          <label htmlFor="button-file">
            <HiddenInput
              accept="image/*"
              id="button-file"
              type="file"
              onChange={handleFileChange}
            />
            <Button
              variant="outlined"
              color="primary"
              component="span"
              disabled={loading}
            >
              이미지 올리기
            </Button>
          </label>
        </Stack>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {previewUrl && (
          <ImagePreviewCard>
            <CardMedia
              component="img"
              height="200"
              image={previewUrl}
              alt="Uploaded Image"
            />
          </ImagePreviewCard>
        )}
      </form>
    </StyledPaper>
  );
};

export default KakaoLink;
