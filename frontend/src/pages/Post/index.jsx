import { useEffect, useState } from "react";

import { useLocation, useParams } from "react-router-dom";

import { Container } from "@mui/material";
import { Box, Typography, Card } from "@mui/joy";

import BarAction from "@/components/BarAction";
import useFetch from "@/hooks/useFetch";

function Post() {
  let { id } = useParams();

  const [post, getPost, cancelPost] = useFetch(`/api/posts/${id}`);
  const [postDetails, setPostDetails] = useState({});

  useEffect(() => {
    getPost().then((data) => {
      if (data?.success != false) {
        setPostDetails(data.data.post);
      }
    });
    return () => {
      cancelPost.cancel();
    };
  }, []);

  let title = postDetails?.title || "Untitled";
  let content = postDetails?.content || "No content available.";
  let author = postDetails?.author?.fullName || "Unknown";
  let createdAt = postDetails?.createdAt || "--||--";
  let updatedAt = postDetails?.updatedAt || "--||--";

  return (
    <>
      <BarAction />
      <Container maxWidth="md">
        <Typography level="h2">{title}</Typography>
        <Typography level="body-sm">Author : {author}</Typography>

        <Box sx={{ my: 2 }}>
          <Typography level="body-xs">
            Created {new Date(createdAt).toLocaleString()}
          </Typography>
          <Typography level="body-xs">
            Last update : {new Date(updatedAt).toLocaleString()}
          </Typography>

          <Card variant="outlined" sx={{ mt: 3, p: 1, minHeight: 300 }}>
            <Typography level="body-sm">{content}</Typography>
          </Card>
        </Box>
      </Container>
    </>
  );
}

export default Post;
