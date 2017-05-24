package projections

import domain._

trait Projections {
  def numberOfEvents(events: List[Event]): Int
  def numberOfRegistredPlayers(events: List[Event]): Int
  def numberOfRegistredPlayersPerMonth(events: List[Event]): List[RegistredPlayersPerMonth]
  def mostPopularQuizs(events: List[Event]): List[PlayedQuiz]
  def inactivePlayers(events: List[Event]): List[PlayedPlayer]
  def activePlayers(events: List[Event]): List[PlayedPlayer]
}

object ProjectionsImpl extends Projections {
  def numberOfEvents(events: List[Event]): Int =
    ???

  def numberOfRegistredPlayers(events: List[Event]): Int =
    ???

  def numberOfRegistredPlayersPerMonth(events: List[Event]): List[RegistredPlayersPerMonth] =
    ???

  def mostPopularQuizs(events: List[Event]): List[PlayedQuiz] =
    ???

  def inactivePlayers(events: List[Event]): List[PlayedPlayer] =
    ???

  def activePlayers(events: List[Event]): List[PlayedPlayer] =
    ???
}
