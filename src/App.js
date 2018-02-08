import React, { Component } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import './App.css';

// import { push as Menu } from 'react-burger-menu'

const Header = props => (
  <h1>My TODO List</h1>
)

const HR = ()=>( <div className="hr"></div> )


const tasks = [
  {taskId: 1, desc: 'Read about JSX', dueDate: '19th,Jan'},
  {taskId: 2, desc: 'Learn HTML5 and CSS3', dueDate: '21st,Jan'},
  {taskId: 3, desc: 'Discuss about GST with CA', dueDate: '02,Feb'},
  {taskId: 4, desc: 'Answer email from client', dueDate: '03,Feb'},
  {taskId: 5, desc: 'Attend workout session in the morning', dueDate: '03,Feb'},
  {taskId: 6, desc: 'Watch Braking Bad last season, dueDate', dueDate: '04,Feb'}
]


const Fade = ({ children, ...props }) => (
  <CSSTransition
                {...props}
                timeout={{enter: 500,exit: 500}}
                classNames="fade"
            >
                {children}
            </CSSTransition >
)




class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      tasks: [...tasks]
    }
  }


  onComplete = (taskId)=>{
    let tasks = [...this.state.tasks]
    tasks.forEach((task,idx)=>{
      if(task.taskId === taskId){
        tasks.splice(idx, 1)
      }
    })
    this.setState({tasks})
  }



  render() {
    return (
      <div className="App">
        <Header />
        <HR />
        <div className="tab">
          <button className="tablinks active">Pending</button>
          <button className="tablinks">Completed</button>
        </div>
          <TransitionGroup className='tasks'>
              {this.state.tasks.map(task => (
                <Fade key={task.taskId}>
                  <div className="round">
                    <i className="fa fa-cube"></i>
                    <span> {task.dueDate} </span>
                    <span className="desc"> {task.desc} </span>
                    <input type="checkbox" id={`cb-${task.taskId}`} onClick={() => this.onComplete(task.taskId)} />
                    <label htmlFor={`cb-${task.taskId}`}></label>
                  </div>
                </Fade>
              ))}
          </TransitionGroup>
      </div>
    );
  }

  // render(){
  //   return(
  //     <div className="App" id="outer-container">
  //       <Menu pageWrapId={'page-wrap'} outerContainerId={'outer-container'}>
  //       <a id="home" className="menu-item" href="/">Home</a>
  //       <a id="about" className="menu-item" href="/about">About</a>
  //       <a id="contact" className="menu-item" href="/contact">Contact</a>
  //       <a  className="menu-item--small" href="">Settings</a>
  //     </Menu>
  //     <main id="page-wrap">
  //       <h1><a href="https://github.com/negomi/react-burger-menu">react-burger-menu</a></h1>
  //     </main>
  //   </div>
  //   )
  // }



}

export default App;
