import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { SiSocketdotio } from "react-icons/si";

const socketClient = io.connect("http://localhost:3001");
function App() {
  const [username, setUsername] = useState("");
  const [sentMsg, setSentMsg] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [toggle, SetToggle] = useState(false);

  const sendMessage = () => {
    if (username == "") {
      toast.error("Username box is empty", { position: "top-right" });
      return;
    }
    if (sentMsg == "") {
      toast.error("Message box is empty", { position: "top-right" });
      return;
    }
    socketClient.emit("sendMsg", { username: username, msg: sentMsg, msgs });
    toast("Message sent successfully", { position: "top-right" });
  };

  useEffect(() => {
    socketClient.on("rcvMsg", (data) => {
      if (data.msgs != msgs) {
        toast.success(`New message received`, {
          position: "top-right",
          theme: "colored",
        });
        setMsgs(data.msgs);
      }
      SetToggle(true);
      // console.log(`${data.username} : ${data.msg}`);
    });
  }, [socketClient]);

  return (
    <div className="App">
      <div className="mainAppDiv">
        <div className="appHeaderDiv">
          <SiSocketdotio style={{ color: "white", fontSize: "5.5vw" }} />
          <h1 style={{ color: "white", fontSize: "2.5vw" }}>
            Socket.io Chatting App
          </h1>
        </div>
        <div className="inputMainDiv">
          <input
            className="usernameInput"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="Enter your Username"
          />

          <input
            className="usernameInput"
            onChange={(e) => {
              setSentMsg(e.target.value);
            }}
            placeholder="Enter your message..."
          />
          <button
            className="sndMsgButton"
            onClick={() => {
              sendMessage();
            }}
          >
            Send Message
          </button>
        </div>

        {toggle == false ? (
          <>
            <h2 style={{ color: "white", fontSize: "1vw" }}>
              No Messages send/received till now
            </h2>
          </>
        ) : (
          <div className="msgMainOuterDiv">
            <h2 style={{ color: "white" }}>Messages sent/received </h2>
            <div className="msgOuterDiv">
              {msgs.map((item, index) => {
                return (
                  <div key={index + 1} className="msgMainDiv">
                    <div className="userName">
                      <p>{item.user}</p>
                    </div>
                    <div className="msg">
                      <p>{item.msg}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
