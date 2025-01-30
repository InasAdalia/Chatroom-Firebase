import { generalChatroom, gamingChatroom, musicChatroom, ninjasChatroom } from "./chat";

const setupUI = ()=>{

    
    let activeRoom = generalChatroom;
    let clickedRoom;

    //open ui of generalChatroom by default
    activeRoom.realtimeListener((chats) => renderChats(chats));

    //update username
    const username = document.querySelector('.username');
    username.textContent += activeRoom
    // username.textContent = activeRoom.getByRoom('username');

    //chatroom buttons listener
    const roomBtns = document.querySelector('.chat-rooms').querySelectorAll('.btn');
    roomBtns.forEach(roomBtn=>{
        roomBtn.addEventListener('click',e=>{
            clickedRoom = e.target.id  //.id memang returns a string
            console.log(clickedRoom)

            //identify the clicked room as active room
            switch (clickedRoom) {
                case 'general':
                    activeRoom = generalChatroom;
                    break;
        
                case 'gaming':
                    activeRoom = gamingChatroom;
                    break;
        
                case 'music':
                    activeRoom = musicChatroom;
                    break;
                
                case 'ninjas':
                    activeRoom = ninjasChatroom;
                    break;
                default:
                    console.log('no active room, clear chatroom UI')
                    break;
            }
            console.log(activeRoom);


            //setup realtime listener to render chat
            activeRoom.realtimeListener((chats) => renderChats(chats));
            console.log('chats fetched')
        })
    })

    //render chat ui
    const renderChats=(chats)=>{

        let curPointer;
        let prevPointer=null;
        const chatContent = document.querySelector('.chat-content');

        chatContent.innerHTML = '';

        chats.forEach(chat=>{
            curPointer = chat;
            // chatContent.innerHTML = ``;

            if(prevPointer===null || prevPointer.username !== chat.username){

                //formatting timestamp to "22 January 2025 11:02pm"
                const fullDateTime = chat.sent_at?.toDate().toLocaleString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                });

                //generate first-text template
                chatContent.innerHTML += `
                <!-- first text -->
                <div class="row chat-div chat-div-1 inc-profile mt-2">
                    <!-- profile pic -->
                    <p class="col-2 text-end profile-">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp" alt="avatar 1" style="width:40px">
                    </p>

                    <!-- username, message and timestamp -->
                    <div class="col">
                        <p class="fw-bold">${chat.username}<span class=" text-muted fw-normal text-end ms-2 timestamp">${fullDateTime}</span></p>
                        <p>${chat.message}</p>
                    </div>
                </div>`
                
            } else {

                //formatting timestamp to "11:02pm" 
                const timeOnly = chat.sent_at?.toDate().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                });

                //generate next-text template
                chatContent.innerHTML += `
                    <div class="row chat-div chat-div-2">
                    <p class="col-2 timestamp text-muted text-end align-self-center" style="visibility: hidden">${timeOnly}</p>
                        <p class="col me-2">${chat.message}</p>
                    </div>
                `
            }
            prevPointer = curPointer;

        })

        //setup hover effect
        chatContent.querySelectorAll('.chat-div-2').forEach(chatDiv=>{
            const timestamp = chatDiv.querySelector('.timestamp');

            chatDiv.addEventListener('mouseover', () => {
                if (timestamp) {
                    timestamp.style.visibility = 'visible'; // Make visible
                }
            });
        
            chatDiv.addEventListener('mouseout', () => {
                if (timestamp) {
                    timestamp.style.visibility = 'hidden'; // Hide again on mouse out
                }
            });
        })
    }

    //send message
    const sendChat = document.querySelector('.new-chat');
    sendChat.addEventListener('submit', e=>{
        e.preventDefault();
        
        activeRoom.addChat(document.querySelector('#message').value, document.querySelector('.username').textContent)
        .then(()=>console.log('clicked and sent'))
        .catch(e=>console.log(e))

        sendChat.reset();
    })


    //update name
    const updateName = document.querySelector('.new-name');
    updateName.addEventListener('submit', e=>{
        e.preventDefault();

        console.log("to be updated: " + document.querySelector('.username').textContent)
        activeRoom.updateName(document.querySelector('.username').textContent, document.querySelector('#name').value);
        username.textContent = document.querySelector('#name').value
        updateName.reset();
    })


}


export {setupUI}