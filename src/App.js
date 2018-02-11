import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import './App.css';


const getMonth = (month)=>{
  switch(month){
    case 0:
      return 'Jan'
    case 1:
      return 'Feb'
    case 2:
      return 'Mar'
    case 3:
      return 'Apr'
    case 4:
      return 'May'
    case 5:
      return 'Jun'
    case 6:
      return 'Jul'
    case 7:
      return 'Aug'
    case 8:
      return 'Sep'
    case 9:
      return 'Oct'
    case 10:
      return 'Nov'
    case 11:
      return 'Dec'
    default:
      return ''
  }
}


const formatDate = (date)=>{
  if(!date){
    return false
  }
  let dt = new Date(date)
  let day = dt.getDate()
  let month = getMonth(dt.getMonth())
  return '' + day + (day%10 === 1 ? "st," : 
                  day%10 === 2 ? "nd," :
                  day%10 === 3 ? "rd," :
                  "th,") + month; 
}




const Header = props => (
  <h1>My TODO List</h1>
)

const HR = ()=>( <div className="hr"></div> )

const Tabs = ({switchTab, tabStatus})=>(
  <div className="tab">
  <button
    onClick={switchTab}
    className={`tablinks ${tabStatus === 'Pending' ? "active" : ""}`}>
    Pending
  </button>
  <button
    onClick={switchTab}
    className={`tablinks ${tabStatus === 'Completed' ? "active" : ""}`}>
    Completed
</button>
</div>
)

const tasks = [
  { taskId: 1, desc: 'Read about JSX', dueDate: '2018-01-19', status: 'Pending' },
  { taskId: 2, desc: 'Learn HTML5 and CSS3', dueDate: '2018-01-21', status: 'Pending' },
  { taskId: 3, desc: 'Discuss about GST with CA', dueDate: '2018-02-02', status: 'Pending' },
  { taskId: 4, desc: 'Answer email from client', dueDate: '2018-02-03', status: 'Pending' },
  { taskId: 5, desc: 'Attend workout session in the morning', dueDate: '2018-02-03', status: 'Completed' },
  { taskId: 6, desc: 'Watch Braking Bad last season', dueDate: '2018-02-04', status: 'Completed' }
]

let newTaskId = 7

const Fade = ({ children, ...props }) => (
  <CSSTransition
    {...props}
    timeout={{ enter: 500, exit: 500 }}
    classNames="fade"
  >
    {children}
  </CSSTransition>
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
          <span> {formatDate(task.dueDate)} </span>
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
          <span> {formatDate(task.dueDate)} </span>
          <span className="desc"> {task.desc} </span>
          <input type="checkbox" id={`cb-${task.taskId}`} onClick={() => props.onMarkPending(task.taskId)} />
          <label htmlFor={`cb-${task.taskId}`}></label>
        </div>
      </FadeReverse>
    ))}
  </TransitionGroup>
  )
}


const ShowButton = (props)=>{
  return(
    <div className="button-effect">
    <a className="effect effect-4" onClick={props.onAddTask}>Add New Task</a>
    </div>
  )
}


class Modal extends Component {
  constructor(props){
    super(props)

    this.__isAttached = false
    this.__el = document.createElement('div')
    this.__modalRoot = document.getElementById('modal-root')
  }

  handleEscClose = (e)=>{
    console.log(e.keyCode)
    if(e.keyCode === 27){
      this.props.handleClose(e)
    }
  }

  handleClose = (e)=>{
    if(e.target === this.__el){
      this.props.handleClose(e)
    }
  }


  attachModal = ()=>{
    this.__modalRoot.appendChild(this.__el)
    this.__el.addEventListener('click', this.handleClose)
    if(this.props.className){
      this.__el.className = this.props.className
    }
    document.addEventListener('keyup', this.handleEscClose)
    this.__isAttached = true
  }

  detachModal = ()=>{
    this.__el.removeEventListener('click', this.handleClose)
    document.removeEventListener('keyup', this.handleEscClose)
    this.__modalRoot.removeChild(this.__el)
    this.__isAttached = false
    this.__stopPropagationAttached = false
  }



  componentDidMount(){
    if(this.props.isOpen){
      this.attachModal()
    }
  }

  componentWillReceiveProps(newProps){
    if(newProps.isOpen && !this.props.isOpen){
      this.attachModal()
    }
    if(!newProps.isOpen && this.props.isOpen){
      this.detachModal()
    }
  }



  componentWillUnmount(){
    if(this.__isAttached){
      this.detachModal()
    }
  }

  render(){
    if(!this.props.isOpen){
      return false
    }
    return ReactDOM.createPortal(this.props.children, this.__el)
  }

}





class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tasks: [...tasks],
      tabStatus: 'Pending',
      newTaskDesc: '',
      dueDate: '',
      showModal: false,
      showError: false,
      errorMessage: ''
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

  onAddTask = (e)=>{
    e.preventDefault()
    console.log('Add New Task');
    let newTaskDesc = ''
    let showModal = true
    let showError = false
    this.setState({newTaskDesc, showModal, showError})
  }

  closeModal = (e)=>{
    console.log('close modal')
    e.preventDefault()
    this.setState({showModal: false})
  }

  onKeyUp = (e)=>{
    console.log('on key up')
    console.log(e.keyCode)
  }

  changeNewTaskDesc = (e)=>this.setState({newTaskDesc: e.target.value})
  changeDueDate = (e)=>{this.setState({dueDate: e.target.value})}

  saveTask = ()=>{
    if(!this.state.newTaskDesc){
      let showError = true
      let errorMessage = 'Please enter task description!'
      this.setState({showError, errorMessage})
      return
    }
    if(!this.state.dueDate){
      let showError = true
      let errorMessage = 'Please enter due date!'
      this.setState({showError, errorMessage})
      return
    }

    let tasks = [...this.state.tasks]
    tasks.push({
      taskId: newTaskId,
      desc: this.state.newTaskDesc,
      dueDate: this.state.dueDate,
      status: 'Pending'
    })
    this.setState({tasks, newTaskDesc: '', dueDate: '', showModal: false, showError: false})
    newTaskId++
  }



  renderAddTask = ()=>{
    return(
      <div className="modal-container">
        <div>
        <label htmlFor="taskDesc">Task Description:</label>
        <input id="taskDesc" type="text" ref={input=> input && input.focus()}
        value={this.state.newTaskDesc}
        onChange={this.changeNewTaskDesc}/>
        </div>
        <div>
        <label htmlFor="dueDate">Due Date:</label>
        <input id="dueDate" type="date" 
        value={this.state.dueDate}
        onChange={this.changeDueDate}/>
        </div>
        <div className="error" style={{opacity: this.state.showError? 1 : 0}}>
          {this.state.errorMessage}
        </div>
        <div>
        <button onClick={this.saveTask}>Save</button>
        <button onClick={this.closeModal}>Close</button>
        </div>
      </div>
    )
  }



  render() {
    return ([
        <div 
        key="app"
        className="App">
          <Header />
          <HR />
          <Tabs tabStatus={this.state.tabStatus}
            switchTab={this.switchTab} />
          {this.state.tabStatus === 'Pending' ?
            <ShowPendingTask
              tasks={this.state.tasks}
              tabStatus={this.state.tabStatus}
              onComplete={this.onComplete} /> : false}

          {this.state.tabStatus === 'Completed' ?
            <ShowCompletedTask
              tasks={this.state.tasks}
              tabStatus={this.state.tabStatus}
              onMarkPending={this.onMarkPending} /> : false}
          <br />
          {this.state.tabStatus === 'Pending' ?
            <ShowButton onAddTask={this.onAddTask} /> : false}
        </div>,
                <Modal 
                  key="modal"
                  className="modal"
                  isOpen={this.state.showModal}
                  handleClose={this.closeModal}>
                  {this.renderAddTask()}
              </Modal>
    ]

    );
  }
}

export default App;
