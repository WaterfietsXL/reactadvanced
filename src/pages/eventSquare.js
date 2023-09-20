import { createContext, useContext, useEffect, useState } from 'react'
import {BrowserRouter as Router,Route,Link, Routes, useParams, useNavigate} from 'react-router-dom'

export default function EventSquare(props){
    var event = props.event
    var categories = props.categories
    return <div key={event.id} className='eventSquare'>
        <Link to={`/details/${event.id}`}>{event.title}</Link>
        <div>{event.tile}</div>
        <div>{event.description}</div>
        <img className='image1' src={event.image}></img>
        <div>{event.startTime}</div>
        <div>{event.endTime}</div>
        <div>{
            event.categoryIds.map(cid => categories.find(c => c.id == cid)?.name)
        }</div>
        <button onClick={() => {
            if(confirm('are you sure you want to delete?')){
                fetch(`http://localhost:3001/events/${event.id}`,{
                    method:'DELETE'
                })
                    .then((response) => response.json())
                    .then((data) => {
                        setRefresh(refresh + 1)
                        toastr.success('event deleted', '')
                    })
                    .catch((err) => {
                        console.log(err.message);
                    });
            }
        }}>X</button>
    </div>
}