// import React from "react";

// const Result = ({ results }) => {
//   const correctAnswers = results.filter((result) => result.isCorrect).length;

//   return (
//     <div>
//       <h2>Test Result</h2>
//       <p>
//         Your Score: {correctAnswers}/{results.length}
//       </p>
//       {results.map((result, index) => (
//         <div key={index}>
//           <h4>{result.question}</h4>
//           <p>
//             Your Answer: {result.userAnswer}{" "}
//             <span style={{ color: result.isCorrect ? "green" : "red" }}>
//               {result.isCorrect ? "Correct" : "Incorrect"}
//             </span>
//           </p>
//           <p>Correct Answer: {result.correctAnswer}</p>
//           <p>Explanation: {result.explanation}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Result;








import React from "react";
import "../styles/Result.css";

const Result = ({ results }) => {
  const correctAnswers = results.filter((result) => result.isCorrect).length;

  return (
    <div className="container">
      <h2>Test Result</h2>
      <p className="score">
        Your Score: {correctAnswers}/{results.length}
      </p>
      {results.map((result, index) => (
        <div key={index} className="result-item">
          <h4>{result.question}</h4>
          <p>
            Your Answer: {result.userAnswer}{" "}
            <span style={{ color: result.isCorrect ? "green" : "red" }}>
              {result.isCorrect ? "Correct" : "Incorrect"}
            </span>
          </p>
          <p>Correct Answer: {result.correctAnswer}</p>
          <p>Explanation: {result.explanation}</p>
        </div>
      ))}
    </div>
  );
};

export default Result;
