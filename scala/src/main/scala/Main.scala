package projections

import java.util.Date

import infra.Helpers
import solutions.LknProjectionsFun

import scala.util.{Failure, Success, Try}

object Main {
  def main(args: Array[String]): Unit = {
    val filename = args(0) // "../data/2.json"
    val resultFile = "../data/results.json"
    val events = Helpers.getEvents(filename)
    val results = Helpers.getResults(resultFile)(filename)

    val p = ProjectionsImpl

    val projections = List(
      ("numberOfEvents", p.numberOfEvents _, results.numberOfEvents),
      ("numberOfRegistredPlayers", p.numberOfRegistredPlayers _, results.numberOfRegistredPlayers),
      ("numberOfRegistredPlayersPerMonth", p.numberOfRegistredPlayersPerMonth _, results.numberOfRegistredPlayersPerMonth),
      ("mostPopularQuizs", p.mostPopularQuizs _, results.mostPopularQuizs),
      ("inactivePlayers", p.inactivePlayers _, results.inactivePlayers),
      ("activePlayers", p.activePlayers _, results.activePlayers)
    )

    println("")
    for ((name, projection, expected) <- projections) {
      val start = new Date()
      val res = Try(projection(events))
      val end = new Date()
      res match {
        case Success(r) if r == expected =>
          println(s"$name OK (${end.getTime - start.getTime} ms)")
        case Success(r) =>
          println(s"$name ERROR (${end.getTime - start.getTime} ms)")
          println("")
          println("expected: " + expected)
          println("result  : " + r)
          println("")
          return
        case Failure(e) =>
          println(s"$name ERROR (${end.getTime - start.getTime} ms) ${e.getMessage}")
          println("")
          return
      }
    }
  }
}
