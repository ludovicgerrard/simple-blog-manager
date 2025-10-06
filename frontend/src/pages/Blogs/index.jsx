import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, Card, CardContent, Typography, Grid } from "@mui/joy";

import useFetch from "@/hooks/useFetch";

import "./style.css";

function Blogs() {
  const [posts, postsApi, cancelPostsApi] = useFetch("/api/blog/posts");
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    postsApi().then((resp) => {
      setAllPosts(resp?.data?.posts?.data || []);
    });

    return () => {
      cancelPostsApi.cancel();
    };
  }, []);

  return (
    <Grid container spacing={2}>
      {allPosts.map((details, key) => (
        <Post key={key} details={details} />
      ))}
    </Grid>
  );
}

function Post({ details }) {
  const navigate = useNavigate();
  let id = details?.id;
  let title = details?.title || "Untitled";
  let content = details?.content || "No content available.";
  let author = details?.author?.fullName || "Unknown";

  const goPost = (id) => {
    navigate(`/post/${id}`);
  };
  return (
    <Grid xs={12} sm={6} md={4}>
      <Card>
        <CardContent>
          <Typography level="title-lg">{title}</Typography>
          <Box>
            <Box className="card-box">
              <Typography level="body-sm">{content}</Typography>
            </Box>
            <Typography
              level="body-xs"
              sx={{
                fontWeight: "100",
                mt: 1,
              }}
            >
              {author}
            </Typography>
          </Box>
        </CardContent>
        <Box>
          <Button variant="soft" size="sm" onClick={() => goPost(id)}>
            Read More
          </Button>
        </Box>
      </Card>
    </Grid>
  );
}

export default Blogs;
