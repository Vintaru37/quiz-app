import './QuestionsPage.css';
import { nanoid } from 'nanoid';
import { decode } from 'html-entities';

export default function QuestionsPage({
	question,
	shuffledAnswers,
	correctAnswer,
	selectedAnswer,
	updateAnswer,
	showAnswers,
}) {
	const displayedAnswers = shuffledAnswers.map((answer) => {
		let cssClass = '';
		if (showAnswers) {
			if (answer === correctAnswer) {
				cssClass = 'correct';
			} else if (
				selectedAnswer !== correctAnswer &&
				answer === selectedAnswer
			) {
				cssClass = 'incorrect';
			}
		}

		return (
			<button
				key={nanoid()}
				className={`answer ${answer === selectedAnswer ? 'picked' : ''} ${cssClass}`}
				onClick={() => updateAnswer(answer, question)}>
				{decode(answer)}
			</button>
		);
	});

	return (
		<div className='boxes'>
			<div className='box'>
				<h2 className='question-title'>{decode(question)}</h2>
				<div className='answers'>{displayedAnswers}</div>
				<div className='line'></div>
			</div>
		</div>
	);
}
