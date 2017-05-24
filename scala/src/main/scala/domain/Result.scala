package domain

case class Result(
                   numberOfEvents: Int,
                   numberOfRegistredPlayers: Int,
                   numberOfRegistredPlayersPerMonth: List[RegistredPlayersPerMonth],
                   mostPopularQuizs: List[PlayedQuiz],
                   inactivePlayers: List[PlayedPlayer],
                   activePlayers: List[PlayedPlayer]
                 )

case class RegistredPlayersPerMonth(month: String, registered_players: Int)
case class PlayedQuiz(quiz_id: String, times_played: Int, quiz_title: String)
case class PlayedPlayer(player_id: String, games_played: Int, player_name: String)
