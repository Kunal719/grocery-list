import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocaleStorage = () => {
  let list=localStorage.getItem("list");
  if(list){
    return JSON.parse(localStorage.getItem("list"))
  }else{
    return []
  }
}

function App() {
  const[name,setName]=useState("");
  const[list,setList]=useState(getLocaleStorage());
  const[isEditing,setIsEditing]=useState(false);
  const[editID,setEditID]=useState(null); //Tells which item we are editing
  const[alert,setAlert]=useState({show:false,msg:"",type:""});

  const showAlert = (show=false,msg="",type="") => {
    setAlert({show,msg,type});
  }

  const handleSubmit = e => {
    e.preventDefault();
    if(!name){   //No Names in List
      //display alert
      showAlert(true,"Please Enter a Valid Item","danger")
    } else if(name && isEditing){
      setList(list.map(item=>{
        if(item.id===editID){
          return {...item,title:name}
        }
        return item;
      })
    )
       setName("");
       setEditID(null);
       setIsEditing(false);
       showAlert(true,"Item Edited Succesfully","success");
    } else{
      //show alert
      showAlert(true,"Item Added Succesfully","success")
      const newItem={
        id:new Date().getTime().toString(),
        title:name
      }
      setList([...list,newItem]);
      setName("");
    }
  };

  const removeItem = id => {
    setList(list.filter(item=>item.id!==id));
    showAlert(true,"Item Removed Succesfully","danger")
  }

  const editItem = id => {
    const specificItem=list.find(item=>item.id===id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title)
  };

  useEffect(()=>{
    localStorage.setItem("list",JSON.stringify(list))
  },[list]);

  return <section className="section-center">
    <form className="grocery-form" onSubmit={handleSubmit}>
      {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
      <h3>Grocery List</h3>
      <div className="form-control">
        <input  
           type="text" 
           className="grocery" 
           placeholder="Add Item"
           value={name} 
           onChange={(e)=>{setName(e.target.value)}} 
           />
        <button type="submit" className="submit-btn">
          {isEditing ? "Edit" : "Submit"}
        </button>
      </div>
    </form>
    {
    list.length > 0 && <div className="grocery-container">
      <List items={list} removeItem={removeItem} editItem={editItem} />
      <button className="clear-btn" onClick={()=>{
        setList([]);
        showAlert(true,"Empty List","danger");
      }}>Clear Items</button>
    </div>
    }
  </section>
}

export default App
