import { generalChatroom, gamingChatroom, musicChatroom, ninjasChatroom } from "./chat";

const setupUI = () => {

    
    let activeRoom = generalChatroom;
    let clickedRoom;

    let unsubscribe; // Store the current listener

    const setupChatListener = (activeRoom) => {
        if (unsubscribe) {
            unsubscribe(); // Stop previous listener
        }
        unsubscribe = activeRoom.realtimeListener((chats) => renderChats(chats));
    };
    
    setupChatListener(activeRoom);

    //updates username display on top of page
    const updateUsernameDisplay= (activeRoom) =>{
        const username = localStorage.getItem('username');
        document.querySelector('.username').textContent = username;
        activeRoom.setUsername(username);
    }
    updateUsernameDisplay(activeRoom);

    //chatroom selection buttons listener
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


            // //setup realtime listener to render chat
            // activeRoom.realtimeListener((chats) => renderChats(chats));
            setupChatListener(activeRoom);
            console.log('chats fetched')
        })
    })

    //render chat ui
    const renderChats=(chats)=>{

        updateUsernameDisplay(activeRoom);

        let curPointer;
        let prevPointer=null;
        const chatContent = document.querySelector('.chat-content');

        chatContent.innerHTML = '';

        chats.forEach(chat=>{
            curPointer = chat;

            //formatting timestamp to "22 January 2025"
            const dateOnly = chat.sent_at?.toDate().toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });

            //formatting timestamp to "11:02pm" 
            const timeOnly = chat.sent_at?.toDate().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
            
            //add divider if new day but not if prevPointer is null.
            if(prevPointer==null || prevPointer!= null && prevPointer.sent_at?.toDate().toDateString() !== chat.sent_at?.toDate().toDateString()){
                chatContent.innerHTML += `
                    <div class="divider d-flex align-items-center mb-1 align-self-center ">
                        <p class="text-center small mx-3 mb-0 text-muted">${dateOnly}</p>
                    </div>
                `
                prevPointer=null;
            }

            if(prevPointer===null || prevPointer.username !== chat.username){

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
                        <p class="fw-bold">${chat.username}<span class=" text-muted fw-normal text-end ms-2 timestamp">${timeOnly}</span></p>
                        <p>${chat.message}</p>
                    </div>
                </div>`
                
            } else {

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

        //auto scroll to bottom of chat
        setTimeout(() => {
            document.querySelector('.card').scrollTop = chatContent.scrollHeight;
          }, 1);
    }

    //send message form
    const sendChat = document.querySelector('.new-chat');
    sendChat.addEventListener('submit', e=>{
        e.preventDefault();
        
        activeRoom.addChat(document.querySelector('#message').value, document.querySelector('.username').textContent)
        .then(()=>console.log('clicked and sent'))
        .catch(e=>console.log(e))

        sendChat.reset();
    })


    //update name form
    const updateName = document.querySelector('.new-name');
    updateName.addEventListener('submit', e=>{
        e.preventDefault();

        console.log("old username: " + document.querySelector('.username').textContent)
        activeRoom.updateName(document.querySelector('.username').textContent, document.querySelector('#name').value);
        localStorage.setItem('username', document.querySelector('#name').value);
        updateUsernameDisplay(activeRoom);
        updateName.reset();
    })


}

export {setupUI}