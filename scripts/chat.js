    import { db, collection, serverTimestamp, addDoc, query, getDocs, where, orderBy, onSnapshot, writeBatch } from './firebase.js';

    class Chatroom{

        constructor(username, room){
            this.username=username
            this.room = room    // general gaming music or ninjas
            this.chatCol = collection(db, 'chats')
        }

        setUsername=(username)=>{
            this.username=username
        }

        addChat = async(message, username)=>{ //will add new chat message into fb chats collection

            //preparing th js object to be added
            const chat={
                username: this.username,
                room: this.room,
                message: message,
                sent_at: serverTimestamp()
            }
            
            return await addDoc(this.chatCol, chat); //actual adding
        } 
        
        realtimeListener = (callback) =>{
            //return a list of chat objects fetched from cols.
            //query: this.room, means that we fetch chats by room

            const queryByRoom = query(
                    query(
                    this.chatCol ,
                    where("room", "==", this.room)), 
                orderBy('sent_at', 'asc'))

            // //fetches chat collection by room
            // const querySnapshot = await getDocs(queryByRoom); 

            onSnapshot( queryByRoom, (querySnapshot) => {   //querySnapshot holds result 
                //make them return an array of chat objects = docs.data()
                let chatsArray=[];
                querySnapshot.forEach(doc => {
                    chatsArray.push({...doc.data(), id: doc.id})
                });

                callback(chatsArray);
            })
            
        }

        updateName = async (oldName, newName) => {
            try {
                const userQuery = query(this.chatCol, where("username", "==", oldName));
                const querySnapshot = await getDocs(userQuery);
        
                const batch = writeBatch(db);
                
                querySnapshot.docs.forEach((doc) => {
                            batch.update(doc.ref, { username: newName });
                        });
                
                await batch.commit();
                
                console.log("Username updated successfully!");
            } catch (error) {
                console.error("Error updating username:", error);
            }
        };
    }

    const generalChatroom = new Chatroom('nas', 'general');
    const gamingChatroom = new Chatroom('nas', 'gaming');
    const musicChatroom = new Chatroom('nas', 'music');
    const ninjasChatroom = new Chatroom('nas', 'ninjas');


    export {generalChatroom, gamingChatroom, musicChatroom, ninjasChatroom}
