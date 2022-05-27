import React, {useRef,useState, useEffect} from 'react';
import './App.css';

import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';
import 'firebase/compat/auth'; 
import 'firebase/compat/analytics';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCU8MVDgn5oGwZFGvvoPxJP7VyL2ku6giE",
  authDomain: "demonchat-6b3bd.firebaseapp.com",
  projectId: "demonchat-6b3bd",
  storageBucket: "demonchat-6b3bd.appspot.com",
  messagingSenderId: "634086521143",
  appId: "1:634086521143:web:63c967cbc23e9eaa8702b2",
  measurementId: "G-Q3G0H01SB0"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <text>Computer Science Society Chat</text>
        <SignOut/>
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn/>}
      </section>

    </div>
  );
}

function SignIn() {

 const signInWithGoogle = () => {
   const provider = new firebase.auth.GoogleAuthProvider();
   auth.signInWithPopup(provider);
 }

return(
  <div class="login">
  <img src={require('./Assets/google.png')} alt='Sign In With Google' onClick={signInWithGoogle} />
  </div>
)

}

function SignOut(){
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){
  const temp =useRef();
  const messagesRef= firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt','desc').limit(100);

  const [messages] = useCollectionData( query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');
  const scrollToBottom = () => {
    temp.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);
  const sendMessage = async(e)=>{
    e.preventDefault();

    const{uid, photoURL} = auth.currentUser;


    
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
 

    setFormValue('');
   
    temp.current.scrollIntoView({behavior: 'smooth'});
  }
 
 
return(
  <>
  <div>
   <main>
      {messages && messages.reverse().map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <span ref={temp}></span>
    </main>
</div>

    <form onSubmit={sendMessage}> 
    <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
    
      <button type= "submit">Submit</button>
    </form>
  </>
)
}

function ChatMessage(props){
  const {text,uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      
      <img className = "profile"src={photoURL || 'https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg'}alt="User Pic" />
      <p>{text}</p>
    </div>
  </>)
}
 
export default App;





