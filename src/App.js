import './App.css';
import StartingPage from './components/StartingPage';
import QuestionsPage from './components/QuestionsPage';
import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

function App() {
	const [page, setPage] = useState('startingPage');
	const [questions, setQuestions] = useState([]);
	const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
	const [showAnswers, setShowAnswers] = useState(false);
	const [showWarning, setShowWarning] = useState(false);
	const [countCorrectAnswers, setCountCorrectAnswers] = useState(0);

	useEffect(() => {
		if (questions.length === 0) {
			try {
				fetch('https://opentdb.com/api.php?amount=5&type=multiple')
					.then((res) => res.json())
					.then((data) => {
						setQuestions(data);
						setQuestionsAndAnswers(
							data.results.map((question) => {
								const allAnswers = [
									...question.incorrect_answers,
									question.correct_answer,
								];
								const shuffledAnswers = shuffleAnswers(allAnswers);

								return {
									question: question.question,
									shuffledAnswers: shuffledAnswers,
									correctAnswer: question.correct_answer,
									selectedAnswer: '',
								};
							})
						);
					});
			} catch (e) {
				console.log(e);
			}
		}
	}, [questions]);

	function shuffleAnswers(array) {
		const shuffled = [...array];
		for (let i = 0; i < shuffled.length; i++) {
			const j = Math.floor(Math.random() * (shuffled.length - i)) + i;
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	}

	function updateAnswer(answer, currentQuestion) {
		setQuestionsAndAnswers((prevState) => {
			return prevState.map((questionObj) => {
				return currentQuestion === questionObj.question
					? { ...questionObj, selectedAnswer: answer }
					: questionObj;
			});
		});
	}

	const countAllCorrectAnswers = (notAllAnswered) => {
		if (!notAllAnswered) {
			for (let i = 0; i < questionsAndAnswers.length; i++) {
				if (
					questionsAndAnswers[i].selectedAnswer ===
					questionsAndAnswers[i].correctAnswer
				) {
					setCountCorrectAnswers((prevState) => prevState + 1);
				}
			}
			setShowAnswers(true);
		}
	};

	const checkAnswers = () => {
		const notAllAnswered = questionsAndAnswers.some(
			(item) => item.selectedAnswer === ''
		);
		setShowWarning(notAllAnswered);
		countAllCorrectAnswers(notAllAnswered);

		if (showAnswers) {
			setTimeout(() => {
				setQuestions([]);
				setCountCorrectAnswers(0);
				setShowAnswers(false);
			}, 500);
		}
	};

	const formattedQuestions = questionsAndAnswers.map((questionObj) => {
		return (
			<QuestionsPage
				key={nanoid()}
				question={questionObj.question}
				shuffledAnswers={questionObj.shuffledAnswers}
				correctAnswer={questionObj.correctAnswer}
				selectedAnswer={questionObj.selectedAnswer}
				updateAnswer={updateAnswer}
				showAnswers={showAnswers}
			/>
		);
	});

	return (
		<div className='App'>
			{page === 'startingPage' && <StartingPage setPage={setPage} />}
			{page === 'questionsPage' && (
				<>
					{formattedQuestions}
					{showWarning && (
						<p className='answers-warning'>
							There are questions not answered yet!
						</p>
					)}
					{showAnswers && (
						<p className='answers-info'>
							You scored {countCorrectAnswers}/{questionsAndAnswers.length}{' '}
							correct answers
						</p>
					)}
					<button
						className='check-answers-play-again-btn'
						onClick={checkAnswers}>
						{showAnswers ? 'Play again' : 'Check answers'}
					</button>
				</>
			)}
		</div>
	);
}

export default App;
