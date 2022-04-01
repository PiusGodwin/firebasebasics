import React,{useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import {db} from '../../Base';

import './Database.css'

import {collection, getDocs, addDoc, doc, deleteDoc, query, Timestamp, orderBy, limit} 
from 'firebase/firestore';

const Database = () => {
    const [newname, setNewname] = useState('');

    const [newage, setNewage] = useState(0);

    const [lsetf, setLsetf] = useState([]);

    const [newtime, setNewTime] = useState(Timestamp.now().toDate())

    const usersCollectionRef = collection(db, "students")  

    const AddStud = async () => {
        await addDoc(usersCollectionRef, {name:newname, age:newage, time:newtime});          
    }

    const remove = () => {
        document.getElementById("text1").value = "";
        document.getElementById("text2").value = "";
    }

    const getData = async () => {  
        const DescAndFirstTen = query(usersCollectionRef, orderBy('time', 'desc'), limit(3))
        const data = await getDocs(DescAndFirstTen)
        setLsetf(data.docs.map((doc) => ({...doc.data(), id:doc.id})));
    }
    

    const DeleteStud = async (id) => {
        const  userDoc = doc(db, "students", id )
        await deleteDoc(userDoc);
    }   
    
function DeletePromt() {
  const message = prompt("Are you sure you want to delete ?")
    if (message == "yes"){
        alert( 'You have successfully deleted the content' );
    }
    else if(message== "no"){
        alert('You didnt delete the content')
        const message2 = prompt("Please input a data")
        alert(message2)
    }
    else {
        alert("There's no such content")
    }   
}    
    useEffect(() => {
        getData();        
    }, []);

  return (
    <Container>
        <input id="text1"  onChange={((event) => {
            setNewname(event.target.value)           
        })} placeholder='name'/>

        <input id="text2"  onChange={((event) => {
            setNewage(event.target.value)          
        })}placeholder='age'/>

        <button  onClick={(() => {
            AddStud(); 
            remove();
        })}
        >Add Student</button>
    

       {lsetf.map((datas) => (
           <div key={datas.id}>
           <h2>Name:{datas.name}</h2>
           <p>Age:{datas.age}</p>
           <p>{datas.time.toDate().toDateString()}</p>

           <button onClick={(() => {
               DeleteStud(datas.id)
               DeletePromt()
           })}>Delete</button>
             {/* <p className='del'>Are you sure you want to delete? <button onClick={(() => {
               DeleteStud(datas.id)
           })}>yes</button></p> */}
       </div>
       ))}
    </Container>
  )
}

export default Database;

const Container = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    div{
        display: flex;
        width: 600px;
        justify-content: space-around;
    }
`