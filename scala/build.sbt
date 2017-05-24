name := "playing with projections"

version := "1.0"

scalaVersion := "2.12.2"

mainClass in (Compile,run) := Some("projections.Main")

libraryDependencies ++= List(
  "com.typesafe.play" %% "play-json" % "2.6.0-M3",
  "org.julienrf" %% "play-json-derived-codecs" % "4.0.0-RC1"
)
