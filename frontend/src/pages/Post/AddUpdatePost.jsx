import { useActionState, useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Container } from "@mui/material";
import {
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  Typography,
  Card,
  Textarea,
} from "@mui/joy";

import BarAction from "@/components/BarAction";

import useFetch from "@/hooks/useFetch";
import { toast } from "react-toastify";

function AddUpdatePost() {
  let location = useLocation();
  const navigate = useNavigate();
  let id =
    location.pathname.split("/")[location.pathname.split("/").length - 1];

  const [formErrors, setFormErrors] = useState(undefined);
  const formRef = useRef(null);
  const [post, postApi, cancelPostApi] = useFetch("/api/blog/posts");
  const [postGet, getPost, cancelPostGet] = useFetch(`/api/blog/posts/${id}`);

  const [state, formAction, isPending] = useActionState(addPostAction, {
    message: "",
    error: false,
  });

  async function addPostAction(prevState, formData) {
    setFormErrors(undefined);

    const errors = validate(formData);

    if (errors) {
      setFormErrors(Object.values(errors).join("\n"));
      return;
    }

    const response = await postApi(formData, "post");
    if (!response.success) {
      toast.error("Failed to add post! " + response.message || "");
    } else {
      toast.success("Post added successfully!");
      // navigate("/");
    }
  }

  useEffect(() => {
    function watchReset(e) {
      e.preventDefault();
    }
    const form = formRef.current;
    form?.addEventListener("reset", watchReset);

    return () => {
      form?.removeEventListener("reset", watchReset);
      cancelPostGet.cancel();
    };
  }, []);

  return (
    <>
      <BarAction />
      <Container maxWidth="sm" sx={{ pt: 4 }}>
        <Typography level="h2" sx={{ fontSize: "xl", mb: 0.5 }}>
          Add Post
        </Typography>

        <form action={formAction} ref={formRef}>
          <Box sx={{ py: 1 }}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input placeholder="Title" name="title" />
            </FormControl>
          </Box>

          <Box sx={{ py: 1 }}>
            <FormControl>
              <FormLabel>Content</FormLabel>
              <Textarea placeholder="Content" minRows={6} name="content" />
            </FormControl>
          </Box>

          {!!formErrors && (
            <Card variant="outlined" color="danger">
              <Box sx={{ p: 0.1 }}>
                <Typography
                  level="body-xs"
                  textColor="inherit"
                  sx={{ whiteSpace: "pre-line" }}
                >
                  {formErrors}
                </Typography>
              </Box>
            </Card>
          )}

          <Box sx={{ py: 2 }}>
            <Button size="sm" type="submit" disabled={post.loading}>
              Publish
            </Button>
          </Box>
        </form>
      </Container>
    </>
  );
}
export default AddUpdatePost;

function validate(formData) {
  let errors = {};

  if (!formData.get("title") || formData.get("title").trim().length < 2) {
    errors.title = "Title is required (min 2 characters).";
  }
  if (!formData.get("content") || formData.get("content").trim().length < 10) {
    errors.content = "Content is required (min 10 characters).";
  }

  return Object.keys(errors).length ? errors : undefined;
}
