package infra

import domain._
import julienrf.json.derived
import play.api.libs.json._

import scala.io.Source

object Helpers {
  implicit val formatPlayerHasRegisteredPayload: Format[PlayerHasRegisteredPayload] = Json.format[PlayerHasRegisteredPayload]
  implicit val formatQuizWasCreatedPayload: Format[QuizWasCreatedPayload] = Json.format[QuizWasCreatedPayload]
  implicit val formatQuestionAddedToQuizPayload: Format[QuestionAddedToQuizPayload] = Json.format[QuestionAddedToQuizPayload]
  implicit val formatQuestionWasCompletedPayload: Format[QuestionWasCompletedPayload] = Json.format[QuestionWasCompletedPayload]
  implicit val formatQuizWasPublishedPayload: Format[QuizWasPublishedPayload] = Json.format[QuizWasPublishedPayload]
  implicit val formatGameWasOpenedPayload: Format[GameWasOpenedPayload] = Json.format[GameWasOpenedPayload]
  implicit val formatPlayerJoinedGamePayload: Format[PlayerJoinedGamePayload] = Json.format[PlayerJoinedGamePayload]
  implicit val formatGameWasStartedPayload: Format[GameWasStartedPayload] = Json.format[GameWasStartedPayload]
  implicit val formatQuestionWasAskedPayload: Format[QuestionWasAskedPayload] = Json.format[QuestionWasAskedPayload]
  implicit val formatAnswerWasGivenPayload: Format[AnswerWasGivenPayload] = Json.format[AnswerWasGivenPayload]
  implicit val formatTimerHasExpiredPayload: Format[TimerHasExpiredPayload] = Json.format[TimerHasExpiredPayload]
  implicit val formatGameWasCancelledPayload: Format[GameWasCancelledPayload] = Json.format[GameWasCancelledPayload]
  implicit val formatGameWasFinishedPayload: Format[GameWasFinishedPayload] = Json.format[GameWasFinishedPayload]
  implicit val formatEvent: OFormat[Event] = derived.flat.oformat((__ \ "type").format[String])

  implicit val formatRegistredPlayersPerMonth: Format[RegistredPlayersPerMonth] = Json.format[RegistredPlayersPerMonth]
  implicit val formatPlayedQuiz: Format[PlayedQuiz] = Json.format[PlayedQuiz]
  implicit val formatPlayedPlayer: Format[PlayedPlayer] = Json.format[PlayedPlayer]
  implicit val formatResult: Format[Result] = Json.format[Result]

  def readFile(path: String): String =
    Source.fromFile(path).mkString

  def getEvents(path: String): List[Event] =
    Json.parse(readFile(path)).as[List[Event]]

  def getResults(path: String): Map[String, Result] =
    Json.parse(readFile(path)).as[Map[String, Result]]
}
