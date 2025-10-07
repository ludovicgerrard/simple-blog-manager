import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
} from "@mui/joy";

import { AuthContext } from "@/services/authService";
import useFetch from "@/hooks/useFetch";
import MoreOptions from "./MoreOptions";

import "./style.css";

function Blogs() {
  let { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, postsApi, cancelPostsApi] = useFetch("/api/posts");
  const [allPosts, setAllPosts] = useState([]);

  const goAddPost = () => navigate("/add-post");
  const getPosts = async () => {
    postsApi().then((resp) => {
      setAllPosts(resp?.data?.posts?.data || []);
    });
  };

  useEffect(() => {
    getPosts();

    return () => {
      cancelPostsApi.cancel();
    };
  }, []);

  if (allPosts.length === 0) {
    return (
      <>
        {isAuth && (
          <Stack direction="row" spacing={1}>
            <Button size="sm" onClick={goAddPost}>
              Add Post
            </Button>
          </Stack>
        )}
        <Card>
          <Typography level="h3">No posts available</Typography>
          <Typography level="body-md">Register & add post</Typography>
        </Card>
      </>
    );
  }

  return (
    <>
      {isAuth && (
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button size="sm" onClick={goAddPost}>
            Add Post
          </Button>
        </Stack>
      )}
      <Grid container spacing={2}>
        {allPosts.map((details, key) => (
          <Post key={key} details={details} getPosts={getPosts} />
        ))}
      </Grid>
    </>
  );
}

function Post({ details, getPosts }) {
  const navigate = useNavigate();
  let id = details?.id;
  let title = details?.title || "Untitled";
  let content = details?.content || "No content available.";
  let author = details?.author || {};

  const goPost = (id) => {
    navigate(`/post/${id}`);
  };
  return (
    <Grid xs={12} sm={6} md={4}>
      <Card>
        <CardContent>
          <Typography level="title-lg" className="long-text">
            {title}
          </Typography>
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
              {author?.fullName || "Unknown Author"}
            </Typography>
          </Box>
        </CardContent>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button variant="soft" size="sm" onClick={() => goPost(id)}>
            Read More
          </Button>

          <MoreOptions
            authorId={author?.id}
            postId={id}
            reloadPosts={getPosts}
          />
        </Stack>
      </Card>
    </Grid>
  );
}

export default Blogs;
