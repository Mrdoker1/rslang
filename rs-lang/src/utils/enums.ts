enum gameChart {
    Points = 1,
    Healths = 2,
    Words = 3,
}

enum gameType {
    Sprint = 1,
    AudioCall = 2,
}

enum gameStatus {
    Started = 1,
    Paused = 2,
    Ended = 3,
}

enum statisticType {
    Daily = 1,
    Total = 2,
}

export { gameChart, gameType, gameStatus, statisticType };
