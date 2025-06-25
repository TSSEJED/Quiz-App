document.addEventListener('DOMContentLoaded', () => {
    // --- Right-Click Protection ---
    const customAlert = document.getElementById('custom-alert');
    const alertOkBtn = document.getElementById('alert-ok-btn');
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        customAlert.style.display = 'flex';
    });
    alertOkBtn.addEventListener('click', () => {
        customAlert.style.display = 'none';
    });

    // --- App Elements ---
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');
    const questionText = document.getElementById('question-text');
    const answerButtons = document.getElementById('answer-buttons');
    const feedback = document.getElementById('feedback');
    const scoreText = document.getElementById('score-text');

    let currentQuestionIndex, score, selectedQuestions;

    // --- Question Bank ---
    const allQuestions = [
        // Beginner Questions
        { question: 'What does HTML stand for?', answers: [{ text: 'HyperText Markup Language', correct: true }, { text: 'High-Level Text Machine Language', correct: false }], difficulty: 'beginner' },
        { question: 'Which tag is used to create a hyperlink?', answers: [{ text: '<a>', correct: true }, { text: '<link>', correct: false }], difficulty: 'beginner' },
        { question: 'What does CSS stand for?', answers: [{ text: 'Cascading Style Sheets', correct: true }, { text: 'Creative Style Syntax', correct: false }], difficulty: 'beginner' },
        { question: 'How do you declare a variable in JavaScript?', answers: [{ text: 'var, let, or const', correct: true }, { text: 'variable', correct: false }], difficulty: 'beginner' },
        { question: 'What is the file extension for a Python file?', answers: [{ text: '.py', correct: true }, { text: '.python', correct: false }], difficulty: 'beginner' },
        
        // Expert Questions
        { question: 'What is the purpose of the `this` keyword in JavaScript?', answers: [{ text: 'It refers to the object it belongs to.', correct: true }, { text: 'It refers to the previous element.', correct: false }], difficulty: 'expert' },
        { question: 'What is a closure in JavaScript?', answers: [{ text: 'A function with access to its outer function scope, even after the outer function has returned.', correct: true }, { text: 'A way to close a memory leak.', correct: false }], difficulty: 'expert' },
        { question: 'What does the `*args` and `**kwargs` syntax do in Python function definitions?', answers: [{ text: 'They allow for a variable number of positional and keyword arguments.', correct: true }, { text: 'They are used for pointer arithmetic.', correct: false }], difficulty: 'expert' },
        { question: 'In CSS, what is the difference between `position: relative` and `position: absolute`?', answers: [{ text: '`relative` is positioned relative to its normal position; `absolute` is positioned relative to its nearest positioned ancestor.', correct: true }, { text: 'They are interchangeable.', correct: false }], difficulty: 'expert' },
        { question: 'What is the Shadow DOM?', answers: [{ text: 'A set of web components features for encapsulating the structure and style of a component.', correct: true }, { text: 'A hidden version of the regular DOM.', correct: false }], difficulty: 'expert' }
    ];

    // --- Event Listeners ---
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => startQuiz(button.dataset.difficulty));
    });

    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        setNextQuestion();
    });

    restartBtn.addEventListener('click', () => {
        resultsScreen.style.display = 'none';
        startScreen.style.display = 'flex';
    });

    // --- Game Logic ---
    function startQuiz(difficulty) {
        selectedQuestions = allQuestions.filter(q => q.difficulty === difficulty);
        currentQuestionIndex = 0;
        score = 0;
        startScreen.style.display = 'none';
        resultsScreen.style.display = 'none';
        quizScreen.style.display = 'flex';
        setNextQuestion();
    }

    function setNextQuestion() {
        resetState();
        if (currentQuestionIndex < selectedQuestions.length) {
            showQuestion(selectedQuestions[currentQuestionIndex]);
        } else {
            showResults();
        }
    }

    function showQuestion(question) {
        questionText.innerText = question.question;
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('answer-btn');
            if (answer.correct) button.dataset.correct = true;
            button.addEventListener('click', selectAnswer);
            answerButtons.appendChild(button);
        });
    }

    function resetState() {
        nextBtn.style.display = 'none';
        feedback.innerText = '';
        while (answerButtons.firstChild) {
            answerButtons.removeChild(answerButtons.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectedButton = e.target;
        const correct = selectedButton.dataset.correct === 'true';

        if (correct) {
            score++;
            feedback.innerText = 'Correct!';
            feedback.style.color = 'var(--correct-color)';
        } else {
            feedback.innerText = 'Incorrect!';
            feedback.style.color = 'var(--incorrect-color)';
        }

        Array.from(answerButtons.children).forEach(button => {
            setStatusClass(button, button.dataset.correct === 'true');
            button.disabled = true;
        });

        if (selectedQuestions.length > currentQuestionIndex + 1) {
            nextBtn.style.display = 'block';
        } else {
            // This is the last question, show results button
            restartBtn.innerText = 'Show Results';
            restartBtn.onclick = showResults; // Temporarily change restart button
            restartBtn.style.display = 'block';
        }
    }

    function setStatusClass(element, correct) {
        if (correct) {
            element.classList.add('correct');
        } else {
            element.classList.add('incorrect');
        }
    }

    function showResults() {
        quizScreen.style.display = 'none';
        resultsScreen.style.display = 'flex';
        scoreText.innerText = `${score} / ${selectedQuestions.length}`;
        // Reset restart button for next game
        restartBtn.innerText = 'Play Again';
        restartBtn.onclick = () => {
            resultsScreen.style.display = 'none';
            startScreen.style.display = 'flex';
        };
    }
});
