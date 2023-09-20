import { createContext, useContext, useEffect, useState } from 'react'
import {BrowserRouter as Router,Route,Link, Routes, useParams, useNavigate} from 'react-router-dom'


export function DetailPage(props){
    let { id } = useParams();
    var navigate = useNavigate()
    var [categories,setCategories] = useState([])
    var [users,setUsers] = useState([])
    const [event, setEvent] = useState({
        "id": 0,
        "createdBy": 0,
        "title": "",
        "description": "",
        "image": "",
        "categoryIds": [
        ],
        "location": "",
        "startTime": "",
        "endTime": ""
    });
    useEffect(() => {
        fetch(`http://localhost:3001/events/${id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setEvent(data);
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

        fetch(`http://localhost:3001/users`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setUsers(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, [])

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setEvent(values => ({...values, [name]: value}))
    }

    

    return <div>
        <div className='detailblock' >
            <Link to="/">go back</Link>
            <button onClick={() => {
                if(confirm('are you sure you want to delete?')){
                    fetch(`http://localhost:3001/events/${id}`,{
                        method:'DELETE'
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            navigate('/')
                            toastr.success('event deleted', '')
                        })
                        .catch((err) => {
                            console.log(err.message);
                            toastr.error(err.message)
                        });
                }
            }}>delete</button>
        </div>
        <br></br>

        <form className='deleteButton' onSubmit={e => {
            e.preventDefault()
            fetch(`http://localhost:3001/events/${id}`,{
                method:'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(event)
            })
                .then((response) => response.json())
                .then((data) => {
                    toastr.success('event saved', '')
                })
                .catch((err) => {
                    toastr.error(err.message)
                    console.log(err.message);
                });
        }}>




            <button type='submit'>save</button>
            <br/>
            <label>id <input readOnly name='id' value={event.id}></input></label>
            <br/>
            <label className='saveButton'>createdBy:&nbsp;
                {(() => {
                    var user = users.find(u => u.id == event.createdBy)
                    if(user){
                        return <div className='createdBy'>
                            <span>{user.name}</span>
                            <img className='image2'src={user.image}></img>
                        </div>
                    }
                })()}
            </label>
            
            <br/>
            <label>title <input name='title' value={event.title} onChange={handleChange}></input></label>
            <br/>
            <label>description <input name='description' value={event.description} onChange={handleChange}></input></label>
            <br/>
            <label>image <input name='image' value={event.image} onChange={handleChange}></input></label>
            <img className='image3' src={event.image}></img>
            <br/>
            <label>location <input name='location' value={event.location} onChange={handleChange}></input></label>
            <br/>
            <label>categories:&nbsp;
            {
                event.categoryIds.map(cid => categories.find(c => c.id == cid)?.name)
            }
            </label>
            
            <br/>
            <label>startTime <input name='startTime' value={event.startTime} onChange={handleChange}></input></label>
            <br/>
            <label>endTime <input name='endTime' value={event.endTime} onChange={handleChange}></input></label>
            <br/>
        </form>

        
    </div>
}