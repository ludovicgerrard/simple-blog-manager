import { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Menu,
  IconButton,
  MenuButton,
  MenuItem,
  Dropdown,
  Button,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Modal,
  ModalDialog,
} from "@mui/joy";

import { AuthContext } from "@/services/authService";
import useFetch from "@/hooks/useFetch";

function MoreOptions(props) {
  const { authorId, postId, reloadPosts } = props;

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  let { isAuth, userInfo } = useContext(AuthContext);

  const [deletePost, deletePostApi, cancelDeletePostApi] = useFetch(
    `/api/posts/${postId}`
  );

  const goEdit = () => {
    navigate(`/update-post/${postId}`);
  };

  const doDelete = async () => {
    await deletePostApi({}, "delete").then((resp) => {
      if (resp.success) {
        toast.success("Post deleted successfully!");
      } else {
        toast.error("Failed to delete post! " + (resp.message || ""));
      }
    });
    setOpen(false);
    reloadPosts();
  };

  if (!(isAuth && userInfo?.id === authorId)) return <></>;

  return (
    <>
      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{
            root: { variant: "solid", color: "warning", size: "sm" },
          }}
        >
          ⁝
        </MenuButton>
        <Menu>
          <MenuItem onClick={goEdit}>Edit</MenuItem>
          <MenuItem onClick={() => setOpen(true)}>Delete</MenuItem>
        </Menu>
      </Dropdown>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>⚠️ Confirmation</DialogTitle>
          <Divider />
          <DialogContent>
            Are you sure you want to delete this post?
          </DialogContent>
          <DialogActions>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="solid" color="danger" onClick={doDelete}>
              Delete post
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
}

export default MoreOptions;
