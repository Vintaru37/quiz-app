//styles
import './StartingPage.css'

export default function StartingPage( { setPage }) {
  return (
    <div className='starting-page-container'>
        <h1 className='title'>Quizzical</h1>
        <p className='subtitle'>Test your knowledge!</p>
        <button onClick={() => setPage("questionsPage")} className="start-btn">Start quiz</button>
    </div>
  )
}
