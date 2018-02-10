import React, { Component } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import './App.css';

// import { push as Menu } from 'react-burger-menu'

const Header = props => (
  <h1>My TODO List</h1>
)

const HR = ()=>( <div className="hr"></div> )


const tasks = [
  { taskId: 1, desc: 'Read about JSX', dueDate: '19th,Jan', status: 'Pending' },
  { taskId: 2, desc: 'Learn HTML5 and CSS3', dueDate: '21st,Jan', status: 'Pending' },
  { taskId: 3, desc: 'Discuss about GST with CA', dueDate: '02,Feb', status: 'Pending' },
  { taskId: 4, desc: 'Answer email from client', dueDate: '03,Feb', status: 'Pending' },
  { taskId: 5, desc: 'Attend workout session in the morning', dueDate: '03,Feb', status: 'Completed' },
  { taskId: 6, desc: 'Watch Braking Bad last season', dueDate: '04,Feb', status: 'Completed' }
]


const Fade = ({ children, ...props }) => (
  <CSSTransition
    {...props}
    timeout={{ enter: 500, exit: 500 }}
    classNames="fade"
  >
    {children}
  </CSSTransition >
)


const FadeReverse = ({ children, ...props }) => (
  <CSSTransition
    {...props}
    timeout={{ enter: 500, exit: 500 }}
    classNames="fade-reverse"
  >
    {children}
  </CSSTransition >
)



const ShowPendingTask = (props)=>{
  let tasks = props.tasks.filter(task => task.status === 'Pending')
  if(tasks.length === 0){
    return <div className='message'><p>No tasks here...</p></div>
  }
  return(
    <TransitionGroup className='tasks'>
    {tasks.map(task => (
      <Fade key={task.taskId} in={task.status === 'Pending'}>
        <div className="round">
          <i className="fa fa-cube"></i>
          <span> {task.dueDate} </span>
          <span className="desc"> {task.desc} </span>
          <input type="checkbox" id={`cb-${task.taskId}`} onClick={() => props.onComplete(task.taskId)} />
          <label htmlFor={`cb-${task.taskId}`}></label>
        </div>
      </Fade>
    ))}
  </TransitionGroup>
  )
}


const ShowCompletedTask = (props)=>{
  let tasks = props.tasks.filter(task => task.status === 'Completed')
  if(tasks.length === 0){
    return <div className='message'><p>No tasks here...</p></div>
  }
  return(
    <TransitionGroup className='tasks'>
    {tasks.map(task => (
      <FadeReverse key={task.taskId} in={task.status === 'Completed'}>
        <div className="round reverse">
          <i className="fa fa-cube"></i>
          <span> {task.dueDate} </span>
          <span className="desc"> {task.desc} </span>
          <input type="checkbox" id={`cb-${task.taskId}`} onClick={() => props.onMarkPending(task.taskId)} />
          <label htmlFor={`cb-${task.taskId}`}></label>
        </div>
      </FadeReverse>
    ))}
  </TransitionGroup>
  )
}



class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tasks: [...tasks],
      tabStatus: 'Pending'
    }
  }


  onComplete = (taskId) => {
    let tasks = [...this.state.tasks]
    tasks.forEach((task, idx) => {
      if (task.taskId === taskId) {
        task.status = 'Completed'
      }
    })
    this.setState({ tasks })
  }

  onMarkPending = (taskId) => {
    let tasks = [...this.state.tasks]
    tasks.forEach(task=>{
      if(task.taskId === taskId){
        task.status = 'Pending'
      }
    })
    this.setState({tasks})
  }



  switchTab = () => {
    this.setState((state, props) => {
      let tabStatus = this.state.tabStatus === 'Pending' ? 'Completed' : 'Pending';
      return { tabStatus }
    })
  }



  render() {
    return (
      <div className="App">
        <Header />
        <HR />
        <div className="tab">
          <button
            onClick={this.switchTab}
            className={`tablinks ${this.state.tabStatus === 'Pending' ? "active" : ""}`}>
            Pending
            </button>
          <button
            onClick={this.switchTab}
            className={`tablinks ${this.state.tabStatus === 'Completed' ? "active" : ""}`}>
            Completed
          </button>
        </div>
        {this.state.tabStatus === 'Pending' ? 
        <ShowPendingTask 
          tasks={this.state.tasks}
          tabStatus={this.state.tabStatus}
          onComplete={this.onComplete} /> :false }

        {this.state.tabStatus === 'Completed' ? 
        <ShowCompletedTask 
          tasks={this.state.tasks}
          tabStatus={this.state.tabStatus}
          onMarkPending={this.onMarkPending} /> :false }
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
