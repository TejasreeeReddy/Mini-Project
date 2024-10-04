import { Toast, Button, Form } from "react-bootstrap";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setMessageRecevied } from "../../redux/actions/chatActions";

const AdminChatRoomComponent = ({ chatRoom, roomIndex, socket, socketUser }) => {
const dispatch = useDispatch()
[window["toast" + roomIndex], window["closeToast" + roomIndex]] = useState(true)
const [rerender, setRerender] = useState(false)

  const close = (socketId) => {
    window["closeToast" + roomIndex](false);
    socket.emit("admin closes chat", socketId)
  }

  const adminSubmitChatMsg = (e, elem) => {
    e.preventDefault();
    if (e.keyCode && e.keyCode !== 13) {
      return;
    }
    const msg = document.getElementById(elem);
    let v = msg.value.trim();
    if (v === "" || v === null || v === false || !v) {
      return;
    }
    chatRoom[1].push({ admin: msg.value })
    socket.emit("admin sends message", {
      user: socketUser,
      message: v
    })
    setRerender(!rerender)
    msg.focus();
    dispatch(setMessageRecevied(false))
    setTimeout(() => {
      msg.value = ""
      const chatMessages = document.querySelector(`.chat-msg${socketUser}`)
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight
      }
    }, 200)
  }

  useEffect(() => {
    const chatMessages = document.querySelector(`.chat-msg${socketUser}`)
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight
    }
  })


  return (
    <>
      <Toast show={window["toast" + roomIndex]} onClose={() => close(chatRoom[0])} className="ms-4 mb-5">
        <Toast.Header>
          <strong className="me-auto">Chat with User</strong>
        </Toast.Header>
        <Toast.Body>
          <div className={`chat-msg${socketUser}`} style={{ maxHeight: "300px", overflow: "auto" }}>
            {chatRoom[1].map((msg, index) => (
              <Fragment key={index}>
                {msg.client && (
                  <p key={index} className="bg-primary p-3 ms-4 text-light rounded-pill">
                    <b>User:</b>{msg.client}
                  </p>
                )}
                {msg.admin && (
                  <p key={index}>
                    <b>Admin:</b> {msg.admin}
                  </p>
                )}
              </Fragment>
            ))}
          </div>

          <Form>
            <Form.Group
              className="mb-3"
              controlId={`adminChatMsg${roomIndex}`}
            >
              <Form.Label>Write a message</Form.Label>
              <Form.Control onKeyUp={(e) => adminSubmitChatMsg(e, `adminChatMsg${roomIndex}`)} as="textarea" rows={2} />
            </Form.Group>
            <Button onClick={(e) => adminSubmitChatMsg(e, `adminChatMsg${roomIndex}`)} variant="success" type="submit">
              Submit
            </Button>
          </Form>

        </Toast.Body>
      </Toast>
    </>
  );
};

export default AdminChatRoomComponent;

