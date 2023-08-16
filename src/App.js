import { createContext, useContext, useEffect, useState } from 'react'
import {BrowserRouter as Router,Route,Link, Routes, useParams, useNavigate} from 'react-router-dom'


console.log('app.js')

function App() {
    return <Router>
        <Link to="/"></Link>
        <Routes>
            <Route path='*' element={<ListPage ></ListPage>}></Route>
            <Route path='/details/:id' element={<DetailPage ></DetailPage>}></Route>
        </Routes>
    </Router>
}

function ListPage(){
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
        <div style={{display:'flex',justifyContent:'center',gap:'20px'}}>
            <label>
                filter
                <input value={filter} onInput={e => {
                    setFilter(e.target.value)
                    setRefresh(refresh + 1)
                }}></input>

            </label>
            <label>
                categoryFilter
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
        <div style={{display:'flex',flexDirection:'column', alignItems:'center'}}>
        {
            // .filter((e) => e.title.search(new RegExp(filter,"i")) >= 0)
            events.filter(e => e.categoryIds.some(cid => categories.find(c => c.id == cid)?.name?.search(new RegExp(categoryFilter)) >= 0)).map(event => {
                return <div key={event.id} style={
                    {border:'1px solid black', padding:'10px', margin:'10px', 
                    borderRadius:'3px', boxShadow:'black 4px 6px 9px 0px'
                }}>
                    <Link to={`/details/${event.id}`}>{event.title}</Link>
                    <div>{event.tile}</div>
                    <div>{event.description}</div>
                    <img style={{maxWidth:'200px'}} src={event.image}></img>
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
            })
        }
        </div>
    </div>
}




function DetailPage(props){
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

        <form onSubmit={e => {
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
            <label>createdBy 
                {(() => {
                    var user = users.find(u => u.id == event.createdBy)
                    if(user){
                        return <div>
                            <span>{user.name}</span>
                            <img style={{maxWidth:'200px'}} src={user.image}></img>
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
            <img style={{maxWidth:'200px'}} src={event.image}></img>
            <br/>
            <label>location <input name='location' value={event.location} onChange={handleChange}></input></label>
            <br/>
            <label>categories 
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

export default App;
