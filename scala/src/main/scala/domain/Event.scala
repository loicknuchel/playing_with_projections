package domain

import java.util.Date

sealed trait Event {
  val id: String
  val timestamp: Date
}

case class PlayerHasRegisteredPayload(player_id: String, last_name: String, first_name: String)
case class PlayerHasRegistered(id: String, timestamp: Date, payload: PlayerHasRegisteredPayload) extends Event

case class QuizWasCreatedPayload(quiz_id: String, quiz_title: String, owner_id: String)
case class QuizWasCreated(id: String, timestamp: Date, payload: QuizWasCreatedPayload) extends Event

case class QuestionAddedToQuizPayload(quiz_id: String, question_id: String, question: String, answer: String)
case class QuestionAddedToQuiz(id: String, timestamp: Date, payload: QuestionAddedToQuizPayload) extends Event

case class QuestionWasCompletedPayload(game_id: String, question_id: String)
case class QuestionWasCompleted(id: String, timestamp: Date, payload: QuestionWasCompletedPayload) extends Event

case class QuizWasPublishedPayload(quiz_id: String)
case class QuizWasPublished(id: String, timestamp: Date, payload: QuizWasPublishedPayload) extends Event

case class GameWasOpenedPayload(quiz_id: String, game_id: String)
case class GameWasOpened(id: String, timestamp: Date, payload: GameWasOpenedPayload) extends Event

case class PlayerJoinedGamePayload(game_id: String, player_id: String)
case class PlayerJoinedGame(id: String, timestamp: Date, payload: PlayerJoinedGamePayload) extends Event

case class GameWasStartedPayload(game_id: String)
case class GameWasStarted(id: String, timestamp: Date, payload: GameWasStartedPayload) extends Event

case class QuestionWasAskedPayload(game_id: String, question_id: String)
case class QuestionWasAsked(id: String, timestamp: Date, payload: QuestionWasAskedPayload) extends Event

case class AnswerWasGivenPayload(game_id: String, question_id: String, player_id: String, answer: String)
case class AnswerWasGiven(id: String, timestamp: Date, payload: AnswerWasGivenPayload) extends Event

case class TimerHasExpiredPayload(game_id: String, question_id: String, player_id: String)
case class TimerHasExpired(id: String, timestamp: Date, payload: TimerHasExpiredPayload) extends Event

case class GameWasCancelledPayload(game_id: String)
case class GameWasCancelled(id: String, timestamp: Date, payload: GameWasCancelledPayload) extends Event

case class GameWasFinishedPayload(game_id: String)
case class GameWasFinished(id: String, timestamp: Date, payload: GameWasFinishedPayload) extends Event
