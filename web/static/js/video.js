import Player from "./player"

let Video = {
  init(socket, element){
    if(!element){ return }
    let msgContainer = document.getElementById("msg-container")
    let msgInput = document.getElementById("msg-input")
    let postButton = document.getElementById("msg-submit")
    let videoId = element.getAttribute("data-id")
    let playerId = element.getAttribute("data-player-id")

    postButton.addEventListener("click", e => {
      let payload = {body: msgInput.value, at: Player.getCurrentTime()}
      vidChannel.push("new_annotation", payload)
      .receive("error", e => console.log(e) )
      msgInput.value = ""})

    Player.init(element.id, playerId)
    socket.connect()
    let vidChannel = socket.channel("videos:" + videoId)
    vidChannel.on("ping", ({count}) => console.log("PING", count))
    vidChannel.on("new_annotation", (resp) => this.renderAnnotation(msgContainer, resp))
    vidChannel.join()
      .receive("ok", ({annotations}) => { annotations.forEach(ann => this.renderAnnotation(msgContainer, ann)) })
      .receive("error", reason => console.log("join failed", reason)),

    this.renderAnnotation = function(msgContainer, {user, body, at}){
      let template = document.createElement("div")
      template.innerHTML = `<b>${user.username}</b>: ${body}`
      msgContainer.appendChild(template)
      msgContainer.scrollTop = msgContainer.scrollHeight }
  }
}
export default Video
