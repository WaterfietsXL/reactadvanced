import { createContext, useContext, useEffect, useState } from 'react'
import {BrowserRouter as Router,Route,Link, Routes, useParams, useNavigate} from 'react-router-dom'
import EventSquare from './eventSquare'

export function ListPage(){
    var navigate = useNavigate()
    const [events, setEvents] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [filter, setFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    var [categories,setCategories] = useState([])

    useEffect(() => {
        fetch(`http://localhost:3001/events?q=${filter}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setEvents(data);
            })
            .catch((err) => {
                console.log(err.message);
            });

        fetch(`http://localhost:3001/categories`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setCategories(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
      }, [refresh])

    
    
    return <div>
        <div className='Listpage'>
            <label>
                filter&nbsp;
                <input value={filter} onInput={e => {
                    setFilter(e.target.value)
                    setRefresh(refresh + 1)
                }}></input>

            </label>
            <label>
                categoryFilter&nbsp;
                <input value={categoryFilter} onInput={e => {
                    setCategoryFilter(e.target.value)
                }}></input>
            </label>
            <button onClick={() => {
                fetch('http://localhost:3001/events',{
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body:JSON.stringify({
                        "id": 0,
                        "createdBy": 1,
                        "title": "",
                        "description": "",
                        "image": "",
                        "categoryIds": [],
                        "location": "",
                        "startTime": "",
                        "endTime": ""
                    })
                }).then((response) => response.json())
                .then((data) => {
                    toastr.success('event created', '')
                    navigate(`/details/${data.id}`)
                })
                .catch((err) => {
                    console.log(err.message);
                    toastr.error(err.message)
                });
            
            }}>create new</button>
        </div>
        <div className='styleButton'>
        {
            // .filter((e) => e.title.search(new RegExp(filter,"i")) >= 0)
            events.filter(e => e.categoryIds.some(cid => categories.find(c => c.id == cid)?.name?.search(new RegExp(categoryFilter)) >= 0)).map(event => {
                return <EventSquare key={event.id} event={event} categories={categories}></EventSquare>
            })
        }
        </div>
    </div>
}